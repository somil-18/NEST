from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from datetime import date

from ..extensions import db
from ..models import User, Listing, Booking

owner_bp = Blueprint('owner', __name__)
api = Api(owner_bp)

# --- UPDATED: More robust helper functions ---

def serialize_tenant_for_dashboard(user):
    """Safely serializes a tenant's public info for the owner's dashboard."""
    if not user:
        # Return a placeholder if the tenant was deleted
        return {"id": None, "username": "Deleted User", "mobile_no": None, "email": None}
    return {
        "id": user.id, "username": user.username,
        "mobile_no": user.mobile_no, "email": user.email
    }

def serialize_booking_for_dashboard(booking):
    """
    Safely serializes a booking's details for the owner's dashboard.
    This function now handles cases where the related listing has been deleted.
    """
    if not booking:
        return None
    
    # --- THIS IS THE FIX ---
    # Create a placeholder for the listing if it has been deleted
    listing_title = booking.listing.title if booking.listing else "Deleted Listing"
    listing_id = booking.listing.id if booking.listing else None
    
    return {
        "booking_id": booking.id,
        "booking_date": booking.appointment_date.isoformat(),
        "status": booking.status,
        "attendees": booking.attendees,
        "listing_title": listing_title,
        "listing_id": listing_id,
        "tenant": serialize_tenant_for_dashboard(booking.tenant)
    }


class OwnerDashboard(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        owner = User.query.get_or_404(user_id)

        if owner.role.lower() != 'owner':
            return {"success": False, "message": "Access denied: Owner role required."}, 403

        today = date.today()
        
        owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id).scalar_subquery()
        total_listings = db.session.query(func.count(Listing.id)).filter(Listing.owner_id == user_id).scalar()
        total_revenue = db.session.query(func.sum(Listing.monthlyRent)).join(Booking, ...).scalar() or 0.0
        total_tenants_today = db.session.query(func.sum(Booking.attendees)).filter(...).scalar() or 0
        
        all_bookings = Booking.query.filter(
            Booking.listing_id.in_(owner_listing_ids)
        ).options(
            joinedload(Booking.listing),
            joinedload(Booking.tenant)
        ).order_by(Booking.appointment_date.desc()).all()

        # The list comprehension will now safely handle all cases
        serialized_bookings = [serialize_booking_for_dashboard(b) for b in all_bookings]
        
        dashboard_data = {
            "summary_stats": {
                "total_listings": total_listings,
                "total_tenants_today": total_tenants_today,
                "total_revenue": round(total_revenue, 2)
            },
            "all_bookings": serialized_bookings
        }
        
        return {"success": True, "data": dashboard_data}


api.add_resource(OwnerDashboard, "/owner/dashboard")
