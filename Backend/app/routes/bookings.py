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


# --- Helper functions that perform the "translation" for outgoing data ---

def serialize_user_summary(user):
    # This function is already correct
    if not user: return None
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

def serialize_listing_summary(listing):
    # This function is already correct
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
        "image_urls": listing.image_urls or [],
    }

def serialize_booking(booking):
    """Translates the database object into the desired JSON format."""
    if not booking: return None
    return {
        "id": booking.id,
        "booking_date": booking.appointment_date.isoformat(), # <-- TRANSLATION: DB `appointment_date` becomes JSON `booking_date`
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
        "booking_date": booking.appointment_date.isoformat(), # <-- TRANSLATION: DB `appointment_date` becomes JSON `booking_date`
        "attendees": booking.attendees,
        "status": booking.status,
        "listing": serialize_listing_summary(booking.listing)
    }


class BookingCreate(Resource):
    @jwt_required()
    def post(self):
        """Schedules a new appointment and ensures a user can only book a listing once."""
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        listing_id = data.get("listing_id")
        booking_date_str = data.get("booking_date")
        attendees = data.get("attendees", 1)

        if not all([listing_id, booking_date_str]):
            return {"success": False, "message": "Missing listing_id or booking_date"}, 400

        # ... (attendees and date format validation remains the same)
            
        try:
            booking_date = datetime.strptime(booking_date_str, "%Y-%m-%d").date()
        except ValueError:
            return {"success": False, "message": "Invalid date format, use YYYY-MM-DD"}, 400

        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        if listing.owner_id == user_id:
            return {"success": False, "message": "You cannot book for your own listing"}, 403

        # --- THIS IS THE NEW VALIDATION LOGIC ---
        # Before checking capacity, first check if this user has EVER booked this listing before.
        existing_booking = Booking.query.filter_by(
            user_id=user_id,
            listing_id=listing_id
        ).first()

        if existing_booking:
            return {"success": False, "message": "You have already booked an appointment for this listing."}, 409 # 409 Conflict
        # ----------------------------------------

        # If the user has never booked before, then we check the daily capacity.
        total_attendees_on_day = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id == listing_id,
            Booking.appointment_date == booking_date,
            Booking.status.in_(["Confirmed", "Pending"])
        ).scalar() or 0

        if total_attendees_on_day + attendees > listing.seating:
            remaining_capacity = listing.seating - total_attendees_on_day
            return {"success": False, "message": f"Daily capacity reached. Only {remaining_capacity} spots left."}, 409

        # If both checks pass, create the new booking.
        booking = Booking(
            user_id=user_id,
            listing_id=listing_id,
            appointment_date=booking_date,
            attendees=attendees
        )
        db.session.add(booking)
        db.session.commit()
        
        return {"success": True, "data": serialize_booking(booking), "message": "Booking scheduled"}, 201


class MyBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        # --- INTERNAL LOGIC: Still uses `appointment_date` to sort ---
        bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.appointment_date.desc()).all()
        result = [serialize_booking_for_self(b) for b in bookings]
        return {"success": True, "data": result}


class OwnerBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        owner_listing_ids = db.session.query(Listing.id).filter(Listing.owner_id == user_id)
        # --- INTERNAL LOGIC: Still uses `appointment_date` to sort ---
        bookings = Booking.query.filter(Booking.listing_id.in_(owner_listing_ids)).order_by(Booking.appointment_date.desc()).all()
        result = [serialize_booking(b) for b in bookings]
        return {"success": True, "data": result}


# update bookings status (owner only) (confirmed or cancelled)
class BookingUpdate(Resource):
    @jwt_required()
    def patch(self, booking_id):
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


# cancel booking (from user side)
class BookingCancel(Resource):
    @jwt_required()
    def delete(self, booking_id):
        user_id = int(get_jwt_identity())
        booking = Booking.query.get_or_404(booking_id, description="Booking not found")

        if booking.user_id != user_id:
            return {"success": False, "message": "Unauthorized to cancel this appointment"}, 403

        db.session.delete(booking)
        db.session.commit()
        return {"success": True, "message": "Appointment cancelled successfully"}, 200


api.add_resource(BookingCreate, "/bookings/create")
api.add_resource(MyBookings, "/bookings/my")
api.add_resource(OwnerBookings, "/bookings/owner")
api.add_resource(BookingUpdate, "/bookings/<int:booking_id>")
api.add_resource(BookingCancel, "/bookings/<int:booking_id>/cancel")




