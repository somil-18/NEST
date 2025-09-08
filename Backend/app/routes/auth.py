import os
import json
import re
from datetime import datetime, timezone
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from argon2.exceptions import VerifyMismatchError
from sqlalchemy import or_
import cloudinary.uploader


from ..extensions import db, mail, ph, jwt
from ..models import User, TokenBlocklist, Booking
from ..routes.bookings import serialize_booking, serialize_booking_for_self
from ..utils.email_utils import send_verification_email, confirm_email_token, send_password_reset_email, confirm_password_reset_token


# image validation
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024 # 5 MB

def allowed_file(filename):
    """Checks if a filename has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def serialize_listing_for_profile(listing):
    """Creates a compact summary of a listing for the owner's profile page."""
    if not listing: return None
    return {
        "id": listing.id, "title": listing.title, "city": listing.city,
        "state": listing.state, "monthlyRent": listing.monthlyRent,
        "main_image_url": listing.image_urls[0] if listing.image_urls else None
    }


# blueprint and API setup
auth_bp = Blueprint('auth', __name__)
api = Api(auth_bp)


# regex patterns
password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
mobile_pattern = r"^[6-9]\d{9}$"


def serialize_user_profile(user):
    if not user: return None
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "mobile_no": user.mobile_no,
        "role": user.role
    }


# JWT blocklist checker
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).one_or_none()
    return token is not None


# confirmation of links
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


@auth_bp.route('/')
def index():
    """A simple welcome message for the root URL."""
    return {"message": "Hello World"}, 200

# registration
class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        username, email, password, mobile_no, role = data.get("username"), data.get("email"), data.get("password"), str(data.get("mobile_no")), data.get("role")

        # validations
        if not all([username, email, password, mobile_no, role]):
            return {"success": False, "message": "Missing fields"}, 400
        if role.lower() not in ["user", "owner"]:
            return {"success": False, "message": "Invalid role"}, 400
        if not re.match(email_pattern, email):
            return {"success": False, "message": "Invalid email format"}, 400
        if not re.match(password_pattern, password):
            return {"success": False, "message": "Password must meet complexity requirements"}, 400
        if not re.match(mobile_pattern, mobile_no):
            return {"success": False, "message": "Invalid mobile number format"}, 400
        
        if User.query.filter(or_(User.username == username, User.email == email)).first():
            return {"success": False, "message": "Username or Email already taken"}, 409

        try:
            hashed_pw = ph.hash(password)
            new_user = User(username=username, email=email, password=hashed_pw, mobile_no=mobile_no, role=role)
            db.session.add(new_user)
            db.session.commit()
            send_verification_email(mail, email)
            return {"success": True, "message": "Check email for verification link"}, 201
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"An error occurred: {e}"}, 500

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

        user_data = serialize_user_profile(user)

        # generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        return {"success": True, "access_token": access_token, "refresh_token": refresh_token, "user": user_data}, 200


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
        """
        Fetches a complete user profile, including listings for owners
        and appointments for both users and owners.
        """
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)

        # Start with the basic profile data
        profile_data = {
            "username": user.username, "email": user.email, "mobile_no": user.mobile_no,
            "role": user.role, "bio": user.bio, "address": user.address,
            "gender": user.gender, "age": user.age,
            "profile_image_url": user.profile_image_url
        }

        if user.role.lower() == 'owner':
            # For owners, get their listings...
            owner_listings = user.listings
            profile_data['my_listings'] = [serialize_listing_for_profile(l) for l in owner_listings]

            # ...and get all appointments for those listings.
            owner_listing_ids = [l.id for l in owner_listings]
            received_appointments = Booking.query.filter(Booking.listing_id.in_(owner_listing_ids)).order_by(Booking.appointment_date.desc()).all()
            profile_data['received_appointments'] = [serialize_booking(b) for b in received_appointments]

        elif user.role.lower() == 'user':
            # For regular users, get the appointments they have made.
            my_appointments = user.bookings
            profile_data['my_appointments'] = [serialize_booking_for_self(b) for b in my_appointments]
        
        return {"success": True, "data": profile_data}


# update profile
class UserProfileUpdate(Resource):
    @jwt_required()
    def patch(self):
        """
        Updates the user's profile. This endpoint is flexible and handles both
        'multipart/form-data' (for image uploads) and 'application/json' (for text-only updates).
        """
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
        data = {}

        # --- THIS IS THE NEW, FLEXIBLE LOGIC ---
        # Check if the request is multipart/form-data
        if 'data' in request.form or 'image' in request.files:
            # Handle image upload if present
            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename != '':
                    if not allowed_file(file.filename):
                        return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
                    file.seek(0, os.SEEK_END)
                    if file.tell() > MAX_CONTENT_LENGTH:
                        return {"success": False, "message": f"File too large: {file.filename}."}, 400
                    file.seek(0)
                    try:
                        upload_result = cloudinary.uploader.upload(file)
                        user.profile_image_url = upload_result['secure_url']
                    except Exception as e:
                        return {"success": False, "message": f"Image upload failed: {str(e)}"}, 500
            
            # Handle text data if present
            if 'data' in request.form:
                try:
                    data = json.loads(request.form['data'])
                except json.JSONDecodeError:
                    return {"success": False, "message": "Invalid JSON in 'data' field"}, 400
        else:
            # If not multipart, assume it's a standard application/json request
            data = request.get_json()
            if data is None:
                return {"success": False, "message": "Invalid JSON or no data provided"}, 400
        
        # --- The validation and update logic is now applied to the 'data' dictionary ---
        # This part of the code remains the same, but it now works for both request types.
        if "username" in data:
            new_username = data["username"]
            if User.query.filter(User.username == new_username, User.id != user_id).first():
                return {"success": False, "message": "Username already taken"}, 409
            user.username = new_username

        if "mobile_no" in data and data["mobile_no"] is not None:
            mobile_no = str(data["mobile_no"])
            if not re.match(mobile_pattern, mobile_no):
                return {"success": False, "message": "Invalid mobile number format"}, 400
            user.mobile_no = mobile_no
            
            if "age" in data: user.age = data.get("age")
            if "gender" in data: user.gender = data.get("gender")
            if "bio" in data: user.bio = data.get("bio")
            if "address" in data: user.address = data.get("address")

        db.session.commit()
        return UserProfileFetch().get()


# delete profile
class UserProfileDelete(Resource):
    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id, description="User not found")
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)
        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        db.session.delete(user)
        db.session.commit()
        return '', 204


api.add_resource(UserRegistration, "/register")
api.add_resource(UserLogin, "/login")
api.add_resource(ChangePassword, "/change-password")
api.add_resource(ForgotPassword, "/forgot-password")
api.add_resource(ResetPassword, "/reset-password/<string:token>")

api.add_resource(TokenRefresh, "/refresh")

api.add_resource(UserProfileFetch, "/profile")
api.add_resource(UserProfileUpdate, "/profile")
api.add_resource(UserProfileDelete, "/profile")





