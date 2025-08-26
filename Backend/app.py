from flask import Flask, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_mail import Mail
from flask_cors import CORS
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from config import Config
from models import db, User, Listing
from utils.email_utils import send_verification_email, confirm_email_token, send_password_reset_email, confirm_password_reset_token
import re


password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


# app setup
app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
mail = Mail(app)
jwt = JWTManager(app)
api = Api(app)
ph = PasswordHasher()

CORS(app, resources={r"/*": {"origins": app.config['FRONTEND_URL']}}, supports_credentials=True)


@app.route('/helloworld')
def hello():
    return {"success": True, "message": "Hello"}, 200


# email confirmation
@app.route('/confirm/<token>')
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
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        # check required fields
        if not username or not email or not password or not role:
            return {"success": False, "message": "Missing fields"}, 400
        
        # validate roles
        if role not in ["user", "owner"]:
            return {"success": False, "message": "Invalid role"}, 400
        
        # validate email format
        if not re.match(email_pattern, email):
            return {"success": False, "message": "Invalid email format"}, 400

        # validate password format
        if not re.match(password_pattern, password):
            return {"success": False,
        "message": "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
    }, 400


        # check if username/email already exist
        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            return {"success": False, "message": "Username or Email already taken"}, 400

        try:
            # hash password
            hashed_pw = ph.hash(password)
            # create new user with role
            new_user = User(username=username, email=email, password=hashed_pw, role=role)
            db.session.add(new_user)
            db.session.commit()

            # send verification email
            try:
                send_verification_email(mail, email)
                return {"success": True, "message": "Check email for verification link"}, 201
            except Exception:
                return {"success": False, "message": "User created but email failed"}, 500

        except:
            db.session.rollback()
            return {"success": False, "message": "Database error"}, 500


# login
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")  
        password = data.get("password")

        # check for missing fields
        if not username or not password:
            return {"success": False, "message": "Missing username or password"}, 400

        # check user by username
        user = User.query.filter((User.username == username)).first()

        if not user:
            return {"success": False, "message": "Invalid credentials"}, 401

        # verify password safely
        try:
            ph.verify(user.password, password)
        except VerifyMismatchError:
            return {"success": False, "message": "Invalid credentials"}, 401


        # check if user is verified
        if not user.is_verified:
            return {"success": False, "message": "Email not verified. Check your inbox."}, 403

        # generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return {
            "success": True,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "role": user.role
        }, 200


# refresh tokens
class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=user_id)
        return {"success": True, "access_token": new_access_token}, 200
    

# reset password
class ChangePassword(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        # basic validation
        if not old_password or not new_password:
            return {"success": False, "message": "Missing fields"}, 400
        
        if not re.match(password_pattern, new_password):
            return {"success": False,
        "message": "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
    }, 400

        # find user
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404

        # verify old password
        try:
            ph.verify(user.password, old_password)
        except VerifyMismatchError:
            return {"success": False, "message": "Old password is incorrect"}, 401

        # hash new password and update
        user.password = ph.hash(new_password)
        try:
            db.session.commit()
            return {"success": True, "message": "Password updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"Database error: {str(e)}"}, 500
        

# ********************************
# forgot password
class ForgotPassword(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")

        if not email:
            return {"success": False, "message": "Email is required"}, 400
        
        # validate email
        if not re.match(email_pattern, email):
            return {"success": False, "message": "Invalid email format"}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"success": False, "message": "User not found"}, 404

        send_password_reset_email(mail, email)
        return {"success": True, "message": "Password reset link sent to your email."}, 200

class ResetPassword(Resource):
    def post(self, token):
        data = request.get_json()
        new_password = data.get("new_password")

        if not new_password:
            return {"success": False, "message": "New password is required"}, 400

        email = confirm_password_reset_token(token)
        if not email:
            return {"success": False, "message": "Invalid or expired token"}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"success": False, "message": "User not found"}, 404

        user.password = ph.hash(new_password)
        db.session.commit()

        return {"success": True, "message": "Password updated successfully"}, 200
    
# ************************************

# create listing
class ListingCreate(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        title = data.get("title")
        description = data.get("description")
        price = data.get("price")
        location = data.get("location")
        user_id = int(get_jwt_identity())  # current user ID from token

        if not title or not price or not location:
            return {"success": False, "message": "Missing required fields"}, 400

        # Fetch user from database
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404

        # Check role
        if user.role != "owner":
            return {"success": False, "message": "Only owners can create listings"}, 403

        # Create listing
        listing = Listing(
            title=title,
            description=description,
            price=price,
            location=location,
            owner_id=user_id
        )
        db.session.add(listing)
        db.session.commit()

        listings = {
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "location": listing.location,
            "owner_id": listing.owner_id
        }

        return {"success": True, "data": listings, "message": "Listing created successfully"}, 201



# read all listings (Public)
class ListingList(Resource):
    def get(self):
        listings = Listing.query.all()
        result = [{"id": l.id, "title": l.title, "description": l.description, "price": l.price, "location": l.location, "owner_id": l.owner_id} for l in listings]

        return {"success": True, "data": result, "message": "Listings fetched successfully"}, 200


# update listing (Owner Only)
class ListingUpdate(Resource):
    @jwt_required()
    def put(self, listing_id):
        user_id = int(get_jwt_identity())
        
        # fetch user from DB
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404

        # check role
        if user.role != "owner":
            return {"success": False, "message": "Only owners can update listings"}, 403

        # fetch listing
        listing = Listing.query.get(listing_id)
        if not listing:
            return {"success": False, "message": "Listing not found"}, 404

        # check ownership
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        # update listing fields
        data = request.get_json()
        listing.title = data.get("title", listing.title)
        listing.description = data.get("description", listing.description)
        listing.price = data.get("price", listing.price)
        listing.location = data.get("location", listing.location)
        db.session.commit()

        updated_listing = {
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "location": listing.location,
            "owner_id": listing.owner_id
        }

        return {"success": True, "data": updated_listing, "message": "Listing updated successfully"}, 200



# delete listing (Owner Only)
class ListingDelete(Resource):
    @jwt_required()
    def delete(self, listing_id):
        user_id = int(get_jwt_identity())

        # Fetch user from DB
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404

        # Check role
        if user.role != "owner":
            return {"success": False, "message": "Only owners can delete listings"}, 403

        # Fetch listing
        listing = Listing.query.get(listing_id)
        if not listing:
            return {"success": False, "message": "Listing not found"}, 404

        # Check ownership
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        # Delete listing
        db.session.delete(listing)
        db.session.commit()
        
        return {"success": True, "data": listing_id, "message": "Listing deleted successfully"}, 200



# end points
api.add_resource(UserRegistration, "/register")
api.add_resource(UserLogin, "/login")
api.add_resource(TokenRefresh, "/refresh")
api.add_resource(ChangePassword, "/change-password")
api.add_resource(ForgotPassword, "/forgot-password")
api.add_resource(ResetPassword, "/reset-password/<string:token>")


api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingUpdate, "/listings/<int:listing_id>")
api.add_resource(ListingDelete, "/listings/<int:listing_id>")


# run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)


