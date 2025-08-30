import re
from datetime import datetime, timezone
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from argon2.exceptions import VerifyMismatchError
from ..extensions import db, mail, ph, jwt
from ..models import User, TokenBlocklist
from ..utils.email_utils import send_verification_email, confirm_email_token, send_password_reset_email, confirm_password_reset_token


# this function is called automatically for every protected endpoint.
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    # checks if the token's JTI (JWT ID) exists in our blocklist database
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).one_or_none()
    # return True if the token is in the blocklist, False otherwise
    return token is not None


# create Blueprint
auth_bp = Blueprint('auth', __name__)
api = Api(auth_bp)


# regex patterns
password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


@auth_bp.route('/helloworld')
def hello():
    return {"success": True, "message": "Hello"}, 200

# confirmation of link
@auth_bp.route('/confirm/<token>')
def confirm_email(token):
    email = confirm_email_token(token)
    if not email:
        return {"success": False, "message": "Invalid or expired link"}, 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return {"success": False, "message": "User not found"}, 404

    if user.is_verified:
        return {"success": True, "message": "Already verified"}, 200

    user.is_verified = True
    db.session.commit()
    return {"success": True, "message": "Email verified successfully"}, 200


# registration
class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        username, email, password, role = data.get("username"), data.get("email"), data.get("password"), data.get("role")

        # validations
        if not all([username, email, password, role]):
            return {"success": False, "message": "Missing fields"}, 400
        if role.lower() not in ["user", "owner"]:
            return {"success": False, "message": "Invalid role"}, 400
        if not re.match(email_pattern, email):
            return {"success": False, "message": "Invalid email format"}, 400
        if not re.match(password_pattern, password):
            return {"success": False, "message": "Password must meet complexity requirements"}, 400
        
        if User.query.filter((User.username == username) | (User.email == email)).first():
            return {"success": False, "message": "Username or Email already taken"}, 400

        try:
            hashed_pw = ph.hash(password) # password hashing
            new_user = User(username=username, email=email, password=hashed_pw, role=role)
            db.session.add(new_user)
            db.session.commit()

            send_verification_email(mail, email)
            return {"success": True, "message": "Check email for verification link"}, 201
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Database error: {e}"}, 500


# login
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        username, password = data.get("username"), data.get("password")

        # validations
        if not username or not password:
            return {"success": False, "message": "Missing username or password"}, 400

        user = User.query.filter_by(username=username).first()
        if not user:
            return {"success": False, "message": "Invalid credentials"}, 401

        # verify password
        try:
            ph.verify(user.password, password)
        except VerifyMismatchError:
            return {"success": False, "message": "Invalid credentials"}, 401

        if not user.is_verified:
            return {"success": False, "message": "Email not verified. Check your inbox."}, 403

        # generating tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        return {"success": True, "access_token": access_token, "refresh_token": refresh_token, "role": user.role}, 200


# generate new access token
class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=user_id)
        return {"success": True, "access_token": new_access_token}, 200


# change password (logged in)
class ChangePassword(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        old_password, new_password = data.get("old_password"), data.get("new_password")

        # validations
        if not old_password or not new_password:
            return {"success": False, "message": "Missing fields"}, 400
        if not re.match(password_pattern, new_password):
            return {"success": False, "message": "New password does not meet complexity requirements"}, 400

        user = User.query.get(user_id)
        try:
            ph.verify(user.password, old_password)
        except VerifyMismatchError:
            return {"success": False, "message": "Old password is incorrect"}, 401

        user.password = ph.hash(new_password)
        db.session.commit()
        return {"success": True, "message": "Password updated successfully"}, 200


# forgot password (logged out)
class ForgotPassword(Resource):
    def post(self):
        email = request.get_json().get("email")
        if not email or not re.match(email_pattern, email):
            return {"success": False, "message": "Valid email is required"}, 400
        
        user = User.query.filter_by(email=email).first()
        if user:
            send_password_reset_email(mail, email)
        
        return {"success": True, "message": "If an account with that email exists, a reset link has been sent."}, 200
# reset password (logged out)
class ResetPassword(Resource):
    def post(self, token):
        new_password = request.get_json().get("new_password")
        if not new_password or not re.match(password_pattern, new_password):
            return {"success": False, "message": "New password does not meet complexity requirements"}, 400

        email = confirm_password_reset_token(token)
        if not email:
            return {"success": False, "message": "Invalid or expired token"}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"success": False, "message": "User not found"}, 404

        user.password = ph.hash(new_password)
        db.session.commit()
        return {"success": True, "message": "Password updated successfully"}, 200

# profile
class UserProfileFetch(Resource):
    @jwt_required()
    def get(self):
        # fetches the current user's complete profile information
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}, 404

        profile_data = {
            "username": user.username, "email": user.email, "role": user.role,
            "bio": user.bio, "mobile_no": user.mobile_no, "address": user.address,
            "gender": user.gender, "age": user.age
        }
        return {"success": True, "data": profile_data}, 200
    

# update profile
class UserProfileUpdate(Resource):
    @jwt_required()
    def patch(self):
        # updates the current user's profile with validation
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}, 404

        data = request.get_json()

        if "username" in data:
            new_username = data["username"]
            if User.query.filter(User.username == new_username, User.id != user_id).first():
                return {"success": False, "message": "Username already taken"}, 409
            user.username = new_username

        if "mobile_no" in data and data["mobile_no"] is not None:
            mobile_no = str(data["mobile_no"])
            if not re.match(r'^[6-9]\d{9}$', mobile_no):
                return {"success": False, "message": "Invalid mobile number format"}, 400
            user.mobile_no = mobile_no

        if "age" in data and data["age"] is not None:
            try:
                age_int = int(data["age"])
                if not (18 <= age_int <= 100):
                    return {"success": False, "message": "Age must be between 18 and 100."}, 400
                user.age = age_int
            except (ValueError, TypeError):
                return {"success": False, "message": "Age must be a valid number."}, 400

        if "gender" in data and data["gender"] is not None:
            gender = data["gender"]
            if gender.lower() not in ["male", "female"]:
                return {"success": False, "message": "Invalid gender."}, 400
            user.gender = gender

        if "bio" in data: user.bio = data["bio"]
        if "address" in data: user.address = data["address"]
        
        db.session.commit()
        return {"success": True, "message": "Profile updated successfully"}, 200


# delete profile
class UserProfileDelete(Resource):
    @jwt_required()
    def delete(self):
        # deletes the user account and adds their current token to the blocklist to immediately invalidate it
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"success": False, "message": "User not found"}, 404
        
        # get the unique identifier (jti) of the token being used
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)
        
        # add the token to the blocklist in the database
        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        
        db.session.delete(user)
        db.session.commit()
        
        return {"success": True, "message": "Account deleted. You have been logged out."}, 200


api.add_resource(UserRegistration, "/register")
api.add_resource(UserLogin, "/login")

api.add_resource(TokenRefresh, "/refresh")

api.add_resource(ChangePassword, "/change-password")
api.add_resource(ForgotPassword, "/forgot-password")
api.add_resource(ResetPassword, "/reset-password/<string:token>")

api.add_resource(UserProfileFetch, "/profile")
api.add_resource(UserProfileUpdate, "/profile")
api.add_resource(UserProfileDelete, "/profile")