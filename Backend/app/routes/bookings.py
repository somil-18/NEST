from datetime import datetime
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Listing, Booking


# create Blueprint
bookings_bp = Blueprint('bookings', __name__)
api = Api(bookings_bp)


# create bookings
class BookingCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json()
        listing_id, start_date, end_date = data.get("listing_id"), data.get("start_date"), data.get("end_date")

        # validations
        if not all([listing_id, start_date, end_date]):
            return {"success": False, "message": "Missing fields"}, 400

        # checking date format
        try:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return {"success": False, "message": "Invalid date format, use YYYY-MM-DD"}, 400

        if start_date_obj > end_date_obj:
            return {"success": False, "message": "Start date cannot be after end date"}, 400

        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        if listing.owner_id == user_id:
            return {"success": False, "message": "You cannot book your own listing"}, 403

        # check for booking conflicts
        existing = Booking.query.filter(
            Booking.listing_id == listing_id, Booking.status.in_(["Confirmed", "Pending"]),
            Booking.start_date <= end_date_obj, Booking.end_date >= start_date_obj
        ).first()
        if existing:
            return {"success": False, "message": "Already booked for selected dates"}, 409 

        booking = Booking(
            user_id=user_id, listing_id=listing_id,
            start_date=start_date_obj, end_date=end_date_obj
        )
        db.session.add(booking)
        db.session.commit()
        return {"success": True, "data": booking.id, "message": "Booking created, awaiting confirmation"}, 201


# view bookings (user)
class MyBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        bookings = Booking.query.filter_by(user_id=user_id).all()
        result = [{"id": b.id, "listing_id": b.listing_id, "start_date": b.start_date.isoformat(),
            "end_date": b.end_date.isoformat(), "status": b.status} for b in bookings]
        return {"success": True, "data": result}, 200


# view bookings (owner)
class OwnerBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())
        listing_ids = [l.id for l in Listing.query.filter_by(owner_id=user_id).all()]
        bookings = Booking.query.filter(Booking.listing_id.in_(listing_ids)).all()
        result = [{"id": b.id, "listing_id": b.listing_id, "start_date": b.start_date.isoformat(),
                "end_date": b.end_date.isoformat(), "status": b.status} for b in bookings]
        return {"success": True, "data": result}, 200


# update status (owner)
class BookingUpdate(Resource):
    @jwt_required()
    def put(self, booking_id):
        user_id = int(get_jwt_identity())
        status = request.get_json().get("status")

        booking = Booking.query.get_or_404(booking_id, description="Booking not found")
        if not status or status.lower() not in ["confirmed", "cancelled"]:
            return {"success": False, "message": "Invalid status"}, 400

        listing = Listing.query.get(booking.listing_id)
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        booking.status = status.capitalize()
        db.session.commit()
        return {"success": True, "message": f"Booking {status.lower()}"}, 200


# cancel booking (user)
class BookingCancel(Resource):
    @jwt_required()
    def delete(self, booking_id):
        user_id = int(get_jwt_identity())
        booking = Booking.query.get_or_404(booking_id, description="Booking not found")

        if booking.user_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        db.session.delete(booking)
        db.session.commit()
        return {"success": True, "message": "Booking cancelled"}, 200


api.add_resource(BookingCreate, "/bookings/create")
api.add_resource(MyBookings, "/bookings/my")
api.add_resource(OwnerBookings, "/bookings/owner")
api.add_resource(BookingUpdate, "/bookings/<int:booking_id>")
api.add_resource(BookingCancel, "/bookings/<int:booking_id>/cancel")