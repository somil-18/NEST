from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User, Listing

favorites_bp = Blueprint('favorites', __name__)
api = Api(favorites_bp)


# --- NEW: Helper function to serialize the owner's public data ---
def serialize_owner_summary(owner):
    """Creates a compact summary of the owner's details."""
    if not owner: return None
    return {
        "id": owner.id,
        "username": owner.username,
        "mobile_no": owner.mobile_no
    }


# --- REPLACED: This function now serializes ALL listing details ---
def serialize_listing_for_favorites(listing):
    """Creates a complete, detailed dictionary for a favorited listing."""
    if not listing: return None
    return {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "street_address": listing.street_address,
        "city": listing.city,
        "state": listing.state,
        "pincode": listing.pincode,
        "monthlyRent": listing.monthlyRent,
        "securityDeposit": listing.securityDeposit,
        "propertyType": listing.propertyType,
        "bedrooms": listing.bedrooms,
        "bathrooms": listing.bathrooms,
        "seating": listing.seating,
        "area": listing.area,
        "furnishing": listing.furnishing,
        "amenities": listing.amenities or [],
        "pid": listing.pid, "ownerName": listing.ownerName, "is_verified": listing.is_verified,
        "image_urls": listing.image_urls or [], # Return all images
        "owner": serialize_owner_summary(listing.owner) # Include nested owner details
    }


class FavoriteList(Resource):
    @jwt_required()
    def get(self):
        """Fetches all of the current user's favorite listings with full details."""
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
            
        favorite_listings = user.favorites
        
        # --- THIS IS THE CHANGE ---
        # Use the new, more detailed serializer.
        return {"success": True, "data": [serialize_listing_for_favorites(l) for l in favorite_listings]}


class FavoriteResource(Resource):
    @jwt_required()
    def post(self, listing_id):
        """Adds a listing to the user's favorites and returns the full listing object."""
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
        listing = Listing.query.get_or_404(listing_id)

        if listing in user.favorites:
            return {"success": False, "message": "Listing already in favorites"}, 409

        user.favorites.append(listing)
        db.session.commit()

        # --- BEST PRACTICE: Return the data that was just created ---
        return {
            "success": True, 
            "data": serialize_listing_for_favorites(listing),
            "message": "Listing added to favorites"
        }, 201

    @jwt_required()
    def delete(self, listing_id):
        """Removes a listing from the user's favorites."""
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
        listing = Listing.query.get_or_404(listing_id)

        if listing not in user.favorites:
            return {"success": False, "message": "Listing not in favorites"}, 404

        user.favorites.remove(listing)
        db.session.commit()
        
        # A 204 No Content response is a professional standard for a successful delete.
        return '', 204


api.add_resource(FavoriteList, "/favorites")
api.add_resource(FavoriteResource, "/favorites/<int:listing_id>")
