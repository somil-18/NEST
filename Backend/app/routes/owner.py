from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import date

from ..extensions import db
from ..models import User, Listing, Booking

owner_bp = Blueprint('owner', __name__)
api = Api(owner_bp)

# --- (Your helper functions for serialization are perfect and remain the same) ---
def serialize_tenant_for_dashboard(user):
    # ... (no change needed)
    pass
def serialize_booking_for_dashboard(booking):
    # ... (no change needed)
    pass


class OwnerDashboard(Resource):
    @jwt_required()
    def get(self):
        """
        Gathers and returns key metrics for an owner's dashboard, including the
        total number of unique tenants who have ever booked.
        """
        user_id = int(get_jwt_identity())
        owner = User.query.get(user_id)

        if not owner or owner.role.lower() != 'owner':
            return {"success": False, "message": "Access denied: Owner role required."}, 403

        today = date.today()
        
        # --- Database Queries for Metrics ---

        owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id).scalar_subquery()

        total_listings = db.session.query(func.count(Listing.id)).filter(Listing.owner_id == user_id).scalar()

        total_revenue = db.session.query(func.sum(Listing.monthlyRent)).join(
            Booking, Booking.listing_id == Listing.id
        ).filter(
            Listing.owner_id == user_id,
            Booking.status == 'Confirmed',
            Booking.appointment_date < today
        ).scalar() or 0.0

        # It counts the number of DISTINCT user_ids from all 'Confirmed' bookings
        # for the owner's properties, giving the total number of unique tenants.
        total_tenants = db.session.query(func.count(Booking.user_id.distinct())).filter(
            Booking.listing_id.in_(owner_listing_ids),
            Booking.status == 'Confirmed'
        ).scalar() or 0
        
        # Get a list of ALL bookings (past, present, and future)
        all_bookings = Booking.query.filter(
            Booking.listing_id.in_(owner_listing_ids)
        ).order_by(Booking.appointment_date.desc()).all()

        # --- Assemble the Final Response ---
        
        dashboard_data = {
            "summary_stats": {
                "total_listings": total_listings,
                # --- THIS IS THE UPDATED METRIC ---
                "total_tenants": total_tenants,
                "total_revenue": round(total_revenue, 2)
            },
            "all_bookings": [serialize_booking_for_dashboard(b) for b in all_bookings]
        }
        
        return {"success": True, "data": dashboard_data}


api.add_resource(OwnerDashboard, "/owner/dashboard")
