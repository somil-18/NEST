# from flask import request, Blueprint
# from flask_restful import Api, Resource
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from sqlalchemy import func
# from sqlalchemy.orm import joinedload
# from datetime import date

# from ..extensions import db
# from ..models import User, Listing, Booking

# owner_bp = Blueprint('owner', __name__)
# api = Api(owner_bp)


# # --- Helper functions to format the response data ---

# def serialize_tenant_for_dashboard(user):
#     """
#     Safely serializes a tenant's FULL public profile for the owner's dashboard.
#     """
#     if not user:
#         return {"id": None, "username": "Deleted User"}
#     return {
#         "id": user.id,
#         "username": user.username,
#         "email": user.email,
#         "mobile_no": user.mobile_no,
#         "bio": user.bio,
#         "address": user.address,
#         "gender": user.gender,
#         "age": user.age,
#         "profile_image_url": user.profile_image_url
#     }

# def serialize_listing_for_dashboard(listing):
#     """Creates a complete, detailed dictionary for a listing in the booking view."""
#     if not listing: return None
#     return {
#         "id": listing.id,
#         "title": listing.title,
#         "description": listing.description,
#         "street_address": listing.street_address,
#         "city": listing.city,
#         "state": listing.state,
#         "pincode": listing.pincode,
#         "propertyType": listing.propertyType,
#         "monthlyRent": listing.monthlyRent,
#         "securityDeposit": listing.securityDeposit,
#         "bedrooms": listing.bedrooms,
#         "bathrooms": listing.bathrooms,
#         "seating": listing.seating,
#         "area": listing.area,
#         "furnishing": listing.furnishing,
#         "amenities": listing.amenities or [],
#         "image_urls": listing.image_urls or [],
#     }

# def serialize_booking_for_dashboard(booking):
#     """Serializes a booking with the FULL nested listing and tenant details."""
#     if not booking: return None
    
#     return {
#         "booking_id": booking.id,
#         "booking_date": booking.appointment_date.isoformat(),
#         "status": booking.status,
#         "attendees": booking.attendees,
#         "listing": serialize_listing_for_dashboard(booking.listing),
#         "tenant": serialize_tenant_for_dashboard(booking.tenant)
#     }


# class OwnerDashboard(Resource):
#     @jwt_required()
#     def get(self):
#         """
#         Gathers and returns key metrics for an owner's dashboard, including the
#         total number of confirmed bookings.
#         """
#         user_id = int(get_jwt_identity())
#         owner = User.query.get_or_404(user_id)

#         if owner.role.lower() != 'owner':
#             return {"success": False, "message": "Access denied: Owner role required."}, 403

#         today = date.today()
        
#         # --- Database Queries for Metrics ---

#         owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id).scalar_subquery()

#         total_listings = db.session.query(func.count(Listing.id)).filter(Listing.owner_id == user_id).scalar() or 0

#         total_revenue = db.session.query(func.sum(Listing.monthlyRent)).join(
#             Booking, Booking.listing_id == Listing.id
#         ).filter(
#             Listing.owner_id == user_id,
#             Booking.status == 'Confirmed',
#             Booking.appointment_date < today
#         ).scalar() or 0.0

#         total_bookings = db.session.query(func.count(Booking.id)).filter(
#             Booking.listing_id.in_(owner_listing_ids),
#             Booking.status == 'Confirmed'
#         ).scalar() or 0
        
#         # --- EFFICIENT & RELIABLE BOOKING QUERY ---
#         # Eagerly loads related listing and tenant data to prevent errors and improve performance.
#         all_bookings = Booking.query.filter(
#             Booking.listing_id.in_(owner_listing_ids)
#         ).options(
#             joinedload(Booking.listing),
#             joinedload(Booking.tenant)
#         ).order_by(Booking.appointment_date.desc()).all()

#         # Safely serialize bookings, handling potential missing data
#         serialized_bookings = [serialize_booking_for_dashboard(b) for b in all_bookings]
        
#         dashboard_data = {
#             "summary_stats": {
#                 "total_listings": total_listings,
#                 "total_bookings": total_bookings,
#                 "total_revenue": round(total_revenue, 2)
#             },
#             "all_bookings": [b for b in serialized_bookings if b is not None]
#         }
        
#         return {"success": True, "data": dashboard_data}


# api.add_resource(OwnerDashboard, "/owner/dashboard")



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


# --- Helper functions to format the response data ---

def serialize_tenant_for_dashboard(user):
    """Safely serializes a tenant's FULL public profile for the owner's dashboard."""
    if not user:
        return {"id": None, "username": "Deleted User"}
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "mobile_no": user.mobile_no,
        "bio": user.bio,
        "address": user.address,
        "gender": user.gender,
        "age": user.age,
        "profile_image_url": user.profile_image_url
    }

# --- THIS IS THE NEW, FULL SERIALIZER ---
def serialize_listing_full_detail(listing):
    """Creates a complete, detailed dictionary for a listing."""
    if not listing: return None
    return {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "street_address": listing.street_address,
        "city": listing.city,
        "state": listing.state,
        "pincode": listing.pincode,
        "propertyType": listing.propertyType,
        "monthlyRent": listing.monthlyRent,
        "securityDeposit": listing.securityDeposit,
        "bedrooms": listing.bedrooms,
        "bathrooms": listing.bathrooms,
        "seating": listing.seating,
        "area": listing.area,
        "furnishing": listing.furnishing,
        "amenities": listing.amenities or [],
        "image_urls": listing.image_urls or []
    }

def serialize_booking_for_dashboard(booking):
    """Serializes a booking with the FULL nested listing and tenant details."""
    if not booking: return None
    
    return {
        "booking_id": booking.id,
        "booking_date": booking.appointment_date.isoformat(),
        "status": booking.status,
        "attendees": booking.attendees,
        # --- THIS IS THE CHANGE ---
        # It now calls the full serializer instead of just returning the title/id.
        "listing": serialize_listing_full_detail(booking.listing),
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
        
        # --- (Your metric calculations are perfect and remain the same) ---
        total_listings = db.session.query(func.count(Listing.id)).filter(Listing.owner_id == user_id).scalar() or 0
        total_revenue = db.session.query(func.sum(Listing.monthlyRent)).join(
            Booking, Booking.listing_id == Listing.id
        ).filter(
            Listing.owner_id == user_id,
            Booking.status == 'Confirmed',
            Booking.appointment_date < today
        ).scalar() or 0.0
        total_bookings = db.session.query(func.count(Booking.id)).filter(
            Booking.listing_id.in_(owner_listing_ids),
            Booking.status == 'Confirmed'
        ).scalar() or 0
        
        # This query correctly and efficiently gets all the necessary data
        all_bookings = Booking.query.filter(
            Booking.listing_id.in_(owner_listing_ids)
        ).options(
            joinedload(Booking.listing),
            joinedload(Booking.tenant)
        ).order_by(Booking.appointment_date.desc()).all()

        serialized_bookings = [serialize_booking_for_dashboard(b) for b in all_bookings]
        
        dashboard_data = {
            "summary_stats": {
                "total_listings": total_listings,
                "total_bookings": total_bookings,
                "total_revenue": round(total_revenue, 2)
            },
            "all_bookings": [b for b in serialized_bookings if b is not None]
        }
        
        return {"success": True, "data": dashboard_data}


api.add_resource(OwnerDashboard, "/owner/dashboard")
