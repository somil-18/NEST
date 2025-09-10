# --- Cleaned up and consolidated imports ---
from datetime import date
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, cast, Date # Import 'cast' and 'Date'
from sqlalchemy.orm import joinedload

from ..extensions import db
from ..models import Listing, Booking, User

# Create Blueprint
bookings_bp = Blueprint('bookings', __name__)
api = Api(bookings_bp)


# --- Helper functions updated to use created_at ---

def serialize_user_summary(user):
    """Safely serializes public user information."""
    if not user: return None
    return { "id": user.id, "username": user.username, "email": user.email, "mobile_no": user.mobile_no }

def serialize_listing_summary(listing):
    """Safely serializes summary listing information for a booking."""
    if not listing: return None
    return {
        "id": listing.id, "title": listing.title, "street_address": listing.street_address,
        "city": listing.city, "state": listing.state,
        "main_image_url": listing.image_urls[0] if listing.image_urls else None
    }

def serialize_booking(booking):
    """Translates the database object into the desired JSON format."""
    if not booking: return None
    return {
        "id": booking.id,
        "booking_date": booking.created_at.date().isoformat(), # <-- USE DATE FROM created_at
        "attendees": booking.attendees,
        "status": booking.status,
        "listing": serialize_listing_summary(booking.listing),
        "tenant": serialize_user_summary(booking.tenant)
    }

def serialize_booking_for_self(booking):
    """A special serializer for the /bookings/my endpoint."""
    if not booking: return None
    return {
        "id": booking.id,
        "booking_date": booking.created_at.date().isoformat(), # <-- USE DATE FROM created_at
        "attendees": booking.attendees,
        "status": booking.status,
        "listing": serialize_listing_summary(booking.listing)
    }


class BookingCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        listing_id = data.get("listing_id")
        attendees = data.get("attendees", 1)
        today = date.today()

        if not listing_id:
            return {"success": False, "message": "Missing listing_id"}, 400
        try:
            attendees = int(attendees)
            if attendees <= 0: raise ValueError
        except (ValueError, TypeError):
            return {"success": False, "message": "Attendees must be a positive number"}, 400

        listing = Listing.query.get_or_404(listing_id)
        if listing.owner_id == user_id:
            return {"success": False, "message": "You cannot book for your own listing"}, 403

        existing_booking_today = Booking.query.filter(
            Booking.user_id == user_id,
            Booking.listing_id == listing_id
        ).first()

        if existing_booking_today:
            return {"success": False, "message": "You have already booked this listing"}, 409

        # Create the new booking.
        booking = Booking(user_id=user_id, listing_id=listing_id, attendees=attendees)
        db.session.add(booking)
        db.session.commit()
        
        return {"success": True, "data": serialize_booking(booking), "message": "Booking scheduled successfully"}, 201


class MyBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
        result = [serialize_booking_for_self(b) for b in bookings]
        return {"success": True, "data": result}


class OwnerBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id)
        bookings = Booking.query.filter(Booking.listing_id.in_(owner_listing_ids)).order_by(Booking.created_at.desc()).all()
        result = [serialize_booking(b) for b in bookings]
        return {"success": True, "data": result}


class BookingUpdate(Resource):
    @jwt_required()
    def patch(self, booking_id):
        user_id = int(get_jwt_identity())
        status = request.get_json().get("status")
        booking = Booking.query.get_or_404(booking_id)
        if not status or status.lower() not in ["confirmed", "cancelled", "left"]:
            return {"success": False, "message": "Invalid status."}, 400
        listing = Listing.query.get(booking.listing_id)
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403
        booking.status = status.capitalize()
        db.session.commit()
        return {"success": True, "data": serialize_booking(booking), "message": f"Booking status updated"}, 200


class BookingCancel(Resource):
    @jwt_required()
    def delete(self, booking_id):
        user_id = int(get_jwt_identity())
        booking = Booking.query.get_or_404(booking_id)
        if booking.user_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403
        db.session.delete(booking)
        db.session.commit()
        return {"success": True, "message": "Booking cancelled successfully"}, 200


api.add_resource(BookingCreate, "/bookings/create")
api.add_resource(MyBookings, "/bookings/my")
api.add_resource(OwnerBookings, "/bookings/owner")
api.add_resource(BookingUpdate, "/bookings/<int:booking_id>")
api.add_resource(BookingCancel, "/bookings/<int:booking_id>/cancel")



