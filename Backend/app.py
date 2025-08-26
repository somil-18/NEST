from flask import Flask, request
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_mail import Mail
from flask_cors import CORS
from argon2 import PasswordHasher
from config import Config
from models import db, User, Listing
from utils.email_utils import send_verification_email, confirm_email_token


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
        role = data.get("role", "user")  # default role is "user"

        # check required fields
        if not username or not email or not password:
            return {"success": False, "message": "Missing fields"}, 400

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
            send_verification_email(mail, email)
            return {"success": True, "message": "Check email for verification link"}, 201
        except:
            db.session.rollback()
            return {"success": False, "message": "Database error"}, 500


# login
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        username_or_email = data.get("username")  # can be username or email
        password = data.get("password")

        # check for missing fields
        if not username_or_email or not password:
            return {"success": False, "message": "Missing username/email or password"}, 400

        # check user by username or email
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if not user:
            return {"success": False, "message": "Invalid credentials"}, 401

        # verify password safely
        try:
            ph.verify(user.password, password)
        except Exception:
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
        result = [{"id": l.id, "title": l.title, "price": l.price, "location": l.location} for l in listings]

        return {"success": True, "data": result, "message": "Listings fetched successfully"}, 200


# update listing (Owner Only)
class ListingUpdate(Resource):
    @jwt_required()
    def put(self, listing_id):
        user_id = int(get_jwt_identity())
        
        # Fetch user from DB
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404

        # Check role
        if user.role != "owner":
            return {"success": False, "message": "Only owners can update listings"}, 403

        # Fetch listing
        listing = Listing.query.get(listing_id)
        if not listing:
            return {"success": False, "message": "Listing not found"}, 404

        # Check ownership
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        # Update listing fields
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
api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingUpdate, "/listings/<int:listing_id>")
api.add_resource(ListingDelete, "/listings/<int:listing_id>")


# run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

