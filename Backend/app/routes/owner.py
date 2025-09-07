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
    if not user: return None
    return {
        "id": user.id,
        "username": user.username,
        "mobile_no": user.mobile_no,
        "email": user.email
    }

def serialize_booking_for_dashboard(booking):
    """
    Safely serializes a booking's details for the owner's dashboard.
    This function now checks if the related listing exists before accessing its properties.
    """
    if not booking or not booking.listing: # <-- ADDED CHECK
        return None # Skip this booking if its listing has been deleted
    
    return {
        "booking_id": booking.id,
        "booking_date": booking.appointment_date.isoformat(),
        "status": booking.status,
        "attendees": booking.attendees,
        "listing_title": booking.listing.title,
        "listing_id": booking.listing.id,
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

        total_revenue = db.session.query(func.sum(Listing.monthlyRent)).join(
            Booking, Booking.listing_id == Listing.id
        ).filter(
            Listing.owner_id == user_id,
            Booking.status == 'Confirmed',
            Booking.appointment_date < today
        ).scalar() or 0.0

        total_tenants_today = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id.in_(owner_listing_ids),
            Booking.appointment_date == today,
            Booking.status.in_(['Confirmed', 'Pending'])
        ).scalar() or 0
        
        all_bookings = Booking.query.filter(
            Booking.listing_id.in_(owner_listing_ids)
        ).options(
            joinedload(Booking.listing),
            joinedload(Booking.tenant)
        ).order_by(Booking.appointment_date.desc()).all()

        # The list comprehension will now safely handle 'None' values
        serialized_bookings = [serialize_booking_for_dashboard(b) for b in all_bookings]
        
        dashboard_data = {
            "summary_stats": {
                "total_listings": total_listings,
                "total_tenants_today": total_tenants_today,
                "total_revenue": round(total_revenue, 2)
            },
            "all_bookings": [b for b in serialized_bookings if b is not None] # Filter out any None values
        }
        
        return {"success": True, "data": dashboard_data}


api.add_resource(OwnerDashboard, "/owner/dashboard")
