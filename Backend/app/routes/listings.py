from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import User, Listing



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
            "price": l.price, "location": l.location, "owner_id": l.owner_id
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
    


api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingResource, "/listings/<int:listing_id>")