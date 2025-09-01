from datetime import datetime
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from ..extensions import db
from ..models import Listing, Booking, User

# Create Blueprint
bookings_bp = Blueprint('bookings', __name__)
api = Api(bookings_bp)


def serialize_user_summary(user):
    """Safely serializes public user information (for owner or tenant)."""
    if not user: return None
    return {
        "id": user.id,
        "username": user.username,
        "mobile_no": user.mobile_no,
        "gender": user.gender,
        "age": user.age
    }


def serialize_listing_summary(listing):
    """Safely serializes summary listing information for a booking."""
    if not listing: return None
    return {
        "id": listing.id,
        "title": listing.title,
        "street_address": listing.street_address,
        "city": listing.city,
        "state": listing.state,
        "main_image_url": listing.image_urls[0] if listing.image_urls else None
    }


def serialize_booking(booking):
    """Serializes a booking object into a full, nested dictionary."""
    if not booking: return None
    return {
        "id": booking.id,
        "appointment_date": booking.appointment_date.isoformat(),
        "attendees": booking.attendees,
        "status": booking.status,
        "listing": serialize_listing_summary(booking.listing),
        "tenant": serialize_user_summary(booking.tenant) # The user who made the booking
    }


def serialize_booking_for_self(booking):
    """
    A special serializer for the /bookings/my endpoint.
    It's the same as the main serializer but omits the redundant 'tenant' field.
    """
    if not booking: return None
    return {
        "id": booking.id,
        "appointment_date": booking.appointment_date.isoformat(),
        "attendees": booking.attendees,
        "status": booking.status,
        "listing": serialize_listing_summary(booking.listing)
        # The 'tenant' field is intentionally left out.
    }

class BookingCreate(Resource):
    @jwt_required()
    def post(self):
        """Schedules a new appointment to view a listing."""
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        listing_id = data.get("listing_id")
        appointment_date_str = data.get("appointment_date")
        attendees = data.get("attendees", 1) # Default to 1 attendee if not specified

        # --- Validations ---
        if not all([listing_id, appointment_date_str]):
            return {"success": False, "message": "Missing listing_id or appointment_date"}, 400

        try:
            attendees = int(attendees)
            if attendees <= 0: raise ValueError
        except (ValueError, TypeError):
            return {"success": False, "message": "Attendees must be a positive number"}, 400
            
        try:
            appointment_date = datetime.strptime(appointment_date_str, "%Y-%m-%d").date()
        except ValueError:
            return {"success": False, "message": "Invalid date format, use YYYY-MM-DD"}, 400

        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        if listing.owner_id == user_id:
            return {"success": False, "message": "You cannot book an appointment for your own listing"}, 403

        # --- New Availability Logic for Daily Capacity ---
        total_attendees_on_day = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id == listing_id,
            Booking.appointment_date == appointment_date,
            Booking.status.in_(["Confirmed", "Pending"])
        ).scalar() or 0

        if total_attendees_on_day + attendees > listing.seating:
            remaining_capacity = listing.seating - total_attendees_on_day
            return {
                "success": False, 
                "message": f"Daily capacity reached. Only {remaining_capacity} more attendees can be scheduled for this day."
            }, 409

        booking = Booking(
            user_id=user_id,
            listing_id=listing_id,
            appointment_date=appointment_date,
            attendees=attendees
        )
        db.session.add(booking)
        db.session.commit()
        
        return {"success": True, "data": serialize_booking(booking), "message": "Appointment scheduled, awaiting confirmation"}, 201


class MyBookings(Resource):
    @jwt_required()
    def get(self):
        """Fetches all appointments made by the current user."""
        user_id = int(get_jwt_identity())
        bookings = Booking.query.filter_by(user_id=user_id).all()
        
        result = [serialize_booking_for_self(b) for b in bookings]

        return {"success": True, "data": result}, 200


class OwnerBookings(Resource):
    @jwt_required()
    def get(self):
        """Fetches all appointments for listings owned by the current user."""
        user_id = int(get_jwt_identity())
        
        # Subquery to get all listing IDs owned by the user
        owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id)
        
        # Get all bookings where the listing_id is in the subquery result
        bookings = Booking.query.filter(Booking.listing_id.in_(owner_listing_ids)).all()
        
        result = [serialize_booking(b) for b in bookings]
        
        return {"success": True, "data": result}, 200


class BookingUpdate(Resource):
    @jwt_required()
    def patch(self, booking_id):
        """Updates the status of an appointment (owner only)."""
        user_id = int(get_jwt_identity())
        status = request.get_json().get("status")

        booking = Booking.query.get_or_404(booking_id, description="Booking not found")
        if not status or status.lower() not in ["confirmed", "cancelled"]:
            return {"success": False, "message": "Invalid status. Must be 'Confirmed' or 'Cancelled'."}, 400

        listing = Listing.query.get(booking.listing_id)
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized to update this booking"}, 403

        booking.status = status.capitalize()
        db.session.commit()
        return {"success": True, "data": serialize_booking(booking), "message": f"Appointment status updated to {status.lower()}"}, 200


class BookingCancel(Resource):
    @jwt_required()
    def delete(self, booking_id):
        """Cancels an appointment (booking creator only)."""
        user_id = int(get_jwt_identity())
        booking = Booking.query.get_or_404(booking_id, description="Booking not found")

        if booking.user_id != user_id:
            return {"success": False, "message": "Unauthorized to cancel this appointment"}, 403

        db.session.delete(booking)
        db.session.commit()
        return {"success": True, "message": "Appointment cancelled successfully"}, 200


# --- API Endpoints (No changes needed here) ---
api.add_resource(BookingCreate, "/bookings/create")
api.add_resource(MyBookings, "/bookings/my")
api.add_resource(OwnerBookings, "/bookings/owner")
api.add_resource(BookingUpdate, "/bookings/<int:booking_id>")
api.add_resource(BookingCancel, "/bookings/<int:booking_id>/cancel")
