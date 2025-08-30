from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, Listing
import cloudinary.uploader
from sqlalchemy.orm.attributes import flag_modified
from flask import request


listings_bp = Blueprint('listings', __name__)
api = Api(listings_bp)


# create listings (owner)
class ListingCreate(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        # validations
        if not user or user.role.lower() != "owner":
            return {"success": False, "message": "Unauthorized"}, 403

        if not data.get("title") or not data.get("price") or not data.get("location"):
            return {"success": False, "message": "Missing required fields"}, 400

        listing = Listing(
            title=data.get("title"), description=data.get("description"),
            price=data.get("price"), amenities=data.get("amenities"),
            location=data.get("location"), owner_id=user_id
        )
        db.session.add(listing)
        db.session.commit()

        return {"success": True, "data": listing.id, "message": "Listing created successfully"}, 201


# view listings (public)
class ListingList(Resource):
    def get(self):
        listings = Listing.query.all()
        result = [{
            "id": l.id, "title": l.title, "description": l.description, "amenities": l.amenities or [],
            "price": l.price, "location": l.location, "image_urls": l.image_urls or [], "owner_id": l.owner_id
        } for l in listings]
        return {"success": True, "data": result}, 200


# update listings (owner)
class ListingResource(Resource):
    @jwt_required()
    def patch(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        data = request.get_json()
        listing.title = data.get("title", listing.title)
        listing.description = data.get("description", listing.description)
        listing.amenities = data.get("amenities", listing.amenities)
        listing.price = data.get("price", listing.price)
        listing.location = data.get("location", listing.location)
        db.session.commit()
        return {"success": True, "message": "Listing updated successfully"}, 200

    # delete listings (owner)
    @jwt_required()
    def delete(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        db.session.delete(listing)
        db.session.commit()
        return {"success": True, "message": "Listing deleted successfully"}, 200


# upload images
class ListingImageUpload(Resource):
    @jwt_required()
    def post(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")

        # validations
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        if 'images' not in request.files:
            return {"success": False, "message": "No 'images' key found in the form-data"}, 400

        files = request.files.getlist('images')
        
        if not files or files[0].filename == '':
            return {"success": False, "message": "No files selected for upload"}, 400

        uploaded_urls = []
        try:
            for file in files:
                upload_result = cloudinary.uploader.upload(file)
                uploaded_urls.append(upload_result['secure_url'])
        except Exception as e:
            return {"success": False, "message": f"Image upload to Cloudinary failed: {str(e)}"}, 500

        if listing.image_urls is None:
            listing.image_urls = []
        
        listing.image_urls.extend(uploaded_urls)
        
        flag_modified(listing, "image_urls")
        
        db.session.commit()

        return {"success": True, "message": "Images uploaded successfully", "image_urls": uploaded_urls}, 201
    

api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingResource, "/listings/<int:listing_id>")
api.add_resource(ListingImageUpload, "/listings/<int:listing_id>/images") 
