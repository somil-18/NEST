from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, cast, Date
from sqlalchemy.orm import joinedload
from datetime import date

from ..extensions import db
from ..models import User, Listing, Booking

owner_bp = Blueprint('owner', __name__)
api = Api(owner_bp)


def serialize_tenant_for_dashboard(user):
    """Safely serializes a tenant's FULL public profile for the owner's dashboard."""
    if not user:
        return {"id": None, "username": "Deleted User"}
    return {
        "id": user.id, "username": user.username, "email": user.email,
        "mobile_no": user.mobile_no, "bio": user.bio, "address": user.address,
        "gender": user.gender, "age": user.age, "profile_image_url": user.profile_image_url
    }

def serialize_listing_for_dashboard(listing, status):
    if not listing: return None
    return {
        "id": listing.id, "pid": listing.pid, "ownerName": listing.ownerName,
        "is_verified": listing.is_verified, "title": listing.title,
        "description": listing.description, "street_address": listing.street_address,
        "city": listing.city, "state": listing.state, "pincode": listing.pincode,
        "propertyType": listing.propertyType, "monthlyRent": listing.monthlyRent,
        "securityDeposit": listing.securityDeposit, "bedrooms": listing.bedrooms,
        "bathrooms": listing.bathrooms, "seating": listing.seating,
        "area": listing.area, "furnishing": listing.furnishing,
        "amenities": listing.amenities or [], "image_urls": listing.image_urls or [],
        "created_at": listing.created_at.isoformat() if listing.created_at else None,
        "availability_status": status 
    }

def serialize_booking_for_dashboard(booking):
    if not booking: return None
    
    today = date.today()
    total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
        Booking.listing_id == booking.listing_id,
        cast(Booking.created_at, Date) == today,
        Booking.status.in_(['Confirmed', 'Pending'])
    ).scalar() or 0
    status = "Booked" if booking.listing.seating is not None and total_attendees_today >= booking.listing.seating else "Available"
    
    return {
        "booking_id": booking.id,
        "booking_date": booking.created_at.date().isoformat(),
        "status": booking.status,
        "attendees": booking.attendees,
        "listing": serialize_listing_for_dashboard(booking.listing, status), 
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
        
        total_listings = db.session.query(func.count(Listing.id)).filter(Listing.owner_id == user_id).scalar() or 0
        total_revenue = db.session.query(func.sum(Listing.monthlyRent)).join(
            Booking, Booking.listing_id == Listing.id
        ).filter(
            Listing.owner_id == user_id,
            Booking.status == 'Confirmed',
            cast(Booking.created_at, Date) < today
        ).scalar() or 0.0
        total_bookings = db.session.query(func.count(Booking.id)).filter(
            Booking.listing_id.in_(owner_listing_ids),
            Booking.status == 'Confirmed'
        ).scalar() or 0
        
        my_listings_query = Listing.query.filter(Listing.owner_id == user_id).order_by(Listing.title).all()
        
        serialized_listings = []
        for l in my_listings_query:
            total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
                Booking.listing_id == l.id,
                cast(Booking.created_at, Date) == today,
                Booking.status.in_(['Confirmed', 'Pending'])
            ).scalar() or 0
            
            status = "Booked" if l.seating is not None and total_attendees_today >= l.seating else "Available"
            
            serialized_listings.append(serialize_listing_for_dashboard(l, status))
        
        all_bookings = Booking.query.filter(
            Booking.listing_id.in_(owner_listing_ids)
        ).options(
            joinedload(Booking.listing),
            joinedload(Booking.tenant)
        ).order_by(Booking.created_at.desc()).all()
        serialized_bookings_list = [serialize_booking_for_dashboard(b) for b in all_bookings]
        
        dashboard_data = {
            "summary_stats": {
                "total_listings": total_listings,
                "total_bookings": total_bookings,
                "total_revenue": round(total_revenue, 2)
            },
            "all_bookings": [b for b in serialized_bookings_list if b is not None],
            "my_listings": serialized_listings 
        }
        
        return {"success": True, "data": dashboard_data}


api.add_resource(OwnerDashboard, "/owner/dashboard")


