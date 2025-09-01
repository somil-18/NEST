from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db
from ..models import User, Listing

favorites_bp = Blueprint('favorites', __name__)
api = Api(favorites_bp)


def serialize_listing_summary(listing):
    """Creates a compact, summary version of a listing for the favorites list."""
    if not listing: return None
    return {
        "id": listing.id,
        "title": listing.title,
        "monthlyRent": listing.monthlyRent,
        "city": listing.city,
        "state": listing.state,
        "main_image_url": listing.image_urls[0] if listing.image_urls else None
    }


class FavoriteList(Resource):
    @jwt_required()
    def get(self):
        """Fetches all of the current user's favorite listings."""
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return {"success": False, "message": "User not found"}, 404
            
        # The 'favorites' relationship automatically gives us the list of listings.
        favorite_listings = user.favorites
        
        return {"success": True, "data": [serialize_listing_summary(l) for l in favorite_listings]}


class FavoriteResource(Resource):
    @jwt_required()
    def post(self, listing_id):
        """Adds a listing to the current user's favorites."""
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id, description="User not found")
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")

        # Check if the user has already favorited this listing
        if listing in user.favorites:
            return {"success": False, "message": "Listing already in favorites"}, 409 # 409 Conflict

        # SQLAlchemy's magic: appending to the list adds a row to our junction table.
        user.favorites.append(listing)
        db.session.commit()

        return {"success": True, "message": "Listing added to favorites"}, 201

    @jwt_required()
    def delete(self, listing_id):
        """Removes a listing from the current user's favorites."""
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id, description="User not found")
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")

        # Check if the listing is actually in the user's favorites
        if listing not in user.favorites:
            return {"success": False, "message": "Listing not in favorites"}, 404

        # SQLAlchemy's magic: removing from the list deletes the row.
        user.favorites.remove(listing)
        db.session.commit()
        
        # A 204 No Content is a professional response for a successful delete.
        return '', 204


api.add_resource(FavoriteList, "/favorites")
api.add_resource(FavoriteResource, "/favorites/<int:listing_id>")