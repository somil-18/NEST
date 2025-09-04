from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import date

from ..extensions import db
from ..models import User, Listing, Booking

owner_bp = Blueprint('owner', __name__)
api = Api(owner_bp)

# --- Helper functions to format the response data ---

def serialize_tenant_for_dashboard(user):
    """Serializes a tenant's public info for the owner's dashboard."""
    if not user: return None
    return {
        "id": user.id,
        "username": user.username,
        "mobile_no": user.mobile_no,
        "email": user.email # It's useful for an owner to have the tenant's email
    }

def serialize_booking_for_dashboard(booking):
    """Serializes an appointment's details for the owner's dashboard."""
    if not booking: return None
    return {
        "booking_id": booking.id,
        "appointment_date": booking.appointment_date.isoformat(),
        "status": booking.status,
        "attendees": booking.attendees,
        "listing_title": booking.listing.title,
        "listing_id": booking.listing.id,
        "tenant": serialize_tenant_for_dashboard(booking.tenant)
    }


class OwnerDashboard(Resource):
    @jwt_required()
    def get(self):
        """
        Gathers and returns all key metrics for an owner's dashboard, including
        a full history of all appointments.
        """
        user_id = int(get_jwt_identity())
        owner = User.query.get(user_id)

        if not owner or owner.role.lower() != 'owner':
            return {"success": False, "message": "Access denied: Owner role required."}, 403

        today = date.today()
        
        # --- Database Queries for Metrics ---

        owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id).scalar_subquery()

        total_listings = db.session.query(func.count(Listing.id)).filter(Listing.owner_id == user_id).scalar()

        total_revenue = db.session.query(func.sum(Listing.securityDeposit)).join(
            Booking, Booking.listing_id == Listing.id
        ).filter(
            Listing.owner_id == user_id,
            Booking.status == 'Confirmed',
            Booking.appointment_date < today
        ).scalar() or 0.0

        total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id.in_(owner_listing_ids),
            Booking.appointment_date == today,
            Booking.status.in_(['Confirmed', 'Pending'])
        ).scalar() or 0
        
        # --- THIS IS THE NEW QUERY ---
        # Get a list of ALL appointments (past, present, and future),
        # ordered by the most recent appointment date first.
        all_appointments = Booking.query.filter(
            Booking.listing_id.in_(owner_listing_ids)
        ).order_by(Booking.appointment_date.desc()).all()

        # --- Assemble the Final Response ---
        
        dashboard_data = {
            "summary_stats": {
                "total_listings": total_listings,
                "total_attendees_today": total_attendees_today,
                "total_revenue": round(total_revenue, 2)
            },
            # --- THIS IS THE NEW DATA ---
            "all_appointments": [serialize_booking_for_dashboard(b) for b in all_appointments]
        }
        
        return {"success": True, "data": dashboard_data}


api.add_resource(OwnerDashboard, "/owner/dashboard")
