# --- Cleaned up and consolidated imports ---
import os
import json
from datetime import date
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, cast, String, func
from sqlalchemy.orm import flag_modified  # <-- CORRECTED IMPORT
import cloudinary.uploader

from ..extensions import db
from ..models import User, Listing, Booking, Review

listings_bp = Blueprint('listings', __name__)
api = Api(listings_bp)

# --- HELPER FUNCTIONS AND CONSTANTS ---

def serialize_owner(owner):
    """Safely serializes an owner's public information."""
    if not owner: return None
    return {
        "id": owner.id, "username": owner.username, "mobile_no": owner.mobile_no,
        "gender": owner.gender, "age": owner.age
    }

# NEW: A dedicated serializer for a full, detailed listing object
def serialize_listing_full_detail(listing):
    """Creates a complete dictionary of a listing's details."""
    if not listing: return None
    return {
        "id": listing.id, "title": listing.title, "description": listing.description,
        "street_address": listing.street_address, "city": listing.city, "state": listing.state, "pincode": listing.pincode,
        "propertyType": listing.propertyType, "monthlyRent": listing.monthlyRent, "securityDeposit": listing.securityDeposit,
        "bedrooms": listing.bedrooms, "bathrooms": listing.bathrooms, "seating": listing.seating,
        "area": listing.area, "furnishing": listing.furnishing, "amenities": listing.amenities or [],
        "image_urls": listing.image_urls or [], "owner": serialize_owner(listing.owner)
    }

# RENAMED & UPDATED: This serializer is for the main list view, including calculated stats
def serialize_listing_for_list_view(listing, status, avg_rating, review_count):
    """Creates a dictionary for the main list, including calculated stats."""
    full_details = serialize_listing_full_detail(listing)
    if not full_details: return None
    
    full_details.update({
        "availability_status": status,
        "average_rating": round(float(avg_rating), 2) if avg_rating else None,
        "review_count": review_count or 0
    })
    return full_details

# --- Validation constants and function defined at the top level ---
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024 # 5 Megabytes

def allowed_file(filename):
    """Checks if a filename has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class ListingCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        user = User.query.get_or_404(user_id)
        if not user or user.role.lower() != "owner":
            return {"success": False, "message": "Unauthorized"}, 403

        if 'data' not in request.form: return {"success": False, "message": "Missing 'data' field"}, 400
        data = json.loads(request.form['data'])
        required_fields = ['title', 'street_address', 'city', 'state', 'pincode', 'propertyType', 'monthlyRent', 
                           'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'area', 'furnishing', 'amenities']
        if not all(field in data for field in required_fields): return {"success": False, "message": "Missing required fields"}, 400
        if 'images' not in request.files or not request.files.getlist('images') or request.files.getlist('images')[0].filename == '':
            return {"success": False, "message": "At least one image is required."}, 400
        
        uploaded_urls = []
        for file in request.files.getlist('images'):
            if not allowed_file(file.filename): return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
            file.seek(0, os.SEEK_END)
            if file.tell() > MAX_CONTENT_LENGTH: return {"success": False, "message": f"File too large: {file.filename}."}, 400
            file.seek(0)
            upload_result = cloudinary.uploader.upload(file)
            uploaded_urls.append(upload_result['secure_url'])
        
        listing = Listing(owner_id=user_id, image_urls=uploaded_urls, **data)
        db.session.add(listing)
        db.session.commit()
        
        # --- FIXED: Return the full, serialized listing object ---
        return {"success": True, "data": serialize_listing_full_detail(listing), "message": "Listing created successfully"}, 201


class ListingList(Resource):
    def get(self):
        today = date.today()
        # Efficiently get all data with subqueries
        review_stats_subquery = db.session.query(
            Review.listing_id,
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('review_count')
        ).group_by(Review.listing_id).subquery()
        attendees_subquery = db.session.query(
            Booking.listing_id,
            func.sum(Booking.attendees).label('total_attendees')
        ).filter(
            Booking.appointment_date == today,
            Booking.status.in_(['Confirmed', 'Pending'])
        ).group_by(Booking.listing_id).subquery()
        
        all_listings_query = db.session.query(
            Listing,
            review_stats_subquery.c.avg_rating,
            review_stats_subquery.c.review_count,
            attendees_subquery.c.total_attendees
        ).outerjoin(
            review_stats_subquery, Listing.id == review_stats_subquery.c.listing_id
        ).outerjoin(
            attendees_subquery, Listing.id == attendees_subquery.c.listing_id
        ).all()
        
        featured_listings = []
        all_listings = []

        for listing, avg_rating, review_count, total_attendees in all_listings_query:
            attendees_today = total_attendees or 0
            status = "Booked" if listing.seating is not None and attendees_today >= listing.seating else "Available"
            
            # --- THIS IS THE CHANGE ---
            # Call the new, more detailed serializer function.
            listing_data = serialize_listing_for_list_view(listing, status, avg_rating, review_count)
            
            all_listings.append(listing_data)
            
            if avg_rating and avg_rating >= 4.0:
                featured_listings.append(listing_data)

        featured_listings.sort(key=lambda x: x.get('average_rating') or 0, reverse=True)
        
        return {
            "success": True, 
            "data": {
                "featured": featured_listings[:5],
                "all_listings": all_listings
            }
        }


class ListingResource(Resource):
    def get(self, listing_id):
        listing = Listing.query.get_or_404(listing_id)
        listing_data = serialize_listing_full_detail(listing)

        # Add calculated stats
        today = date.today()
        total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id == listing.id, Booking.appointment_date == today,
            Booking.status.in_(['Confirmed', 'Pending'])).scalar() or 0
        listing_data['availability_status'] = "Booked" if listing.seating is not None and total_attendees_today >= listing.seating else "Available"

        review_stats = db.session.query(func.avg(Review.rating), func.count(Review.id)).filter(Review.listing_id == listing.id).first()
        avg_rating, review_count = review_stats or (None, 0)
        listing_data['average_rating'] = round(float(avg_rating), 2) if avg_rating else None
        listing_data['review_count'] = review_count

        # Add reviews
        reviews_data = [{"id": r.id, "author_username": r.author.username, "rating": r.rating, 
                         "comment": r.comment, "created_at": r.created_at.isoformat()} for r in listing.reviews]
        listing_data["reviews"] = reviews_data
        
        return {"success": True, "data": listing_data}
    
    @jwt_required()
    def patch(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id)
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        data = {}
        # Flexible logic to handle both request types
        if 'data' in request.form or 'images' in request.files:
            if 'images' in request.files:
                files = request.files.getlist('images')
                if files and files[0].filename != '':
                    uploaded_urls = []
                    for file in files:
                        if not allowed_file(file.filename):
                            return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
                        file.seek(0, os.SEEK_END)
                        if file.tell() > MAX_CONTENT_LENGTH:
                            return {"success": False, "message": f"File too large: {file.filename}."}, 400
                        file.seek(0)
                        upload_result = cloudinary.uploader.upload(file)
                        uploaded_urls.append(upload_result['secure_url'])
                    listing.image_urls = uploaded_urls
            
            if 'data' in request.form:
                data = json.loads(request.form['data'])
        else:
            data = request.get_json()
            if data is None:
                return {"success": False, "message": "Invalid JSON or no data provided"}, 400
        
        for field in ['title', 'description', 'street_address', 'city', 'state', 'pincode', 'propertyType', 
                      'monthlyRent', 'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'area', 
                      'furnishing', 'amenities']:
            if field in data:
                setattr(listing, field, data[field])
        
        if 'amenities' in data:
            flag_modified(listing, "amenities")
        if 'images' in request.files and request.files.getlist('images')[0].filename != '':
            flag_modified(listing, "image_urls")

        db.session.commit()
        return self.get(listing_id)

    @jwt_required()
    def delete(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id)
        if listing.owner_id != user_id: return {"success": False, "message": "Unauthorized"}, 403
        db.session.delete(listing)
        db.session.commit()
        return '', 204


class ListingImageUpload(Resource):
    @jwt_required()
    def post(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id)
        if listing.owner_id != user_id: return {"success": False, "message": "Unauthorized"}, 403
        if 'images' not in request.files: return {"success": False, "message": "No 'images' key found"}, 400
        files = request.files.getlist('images')
        if not files or files[0].filename == '': return {"success": False, "message": "No files selected"}, 400

        uploaded_urls = []
        for file in files:
            if not allowed_file(file.filename):
                return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
            file.seek(0, os.SEEK_END)
            if file.tell() > MAX_CONTENT_LENGTH:
                return {"success": False, "message": f"File too large: {file.filename}."}, 400
            file.seek(0)
            upload_result = cloudinary.uploader.upload(file)
            uploaded_urls.append(upload_result['secure_url'])

        if listing.image_urls is None: listing.image_urls = []
        listing.image_urls.extend(uploaded_urls)
        flag_modified(listing, "image_urls")
        db.session.commit()
        return {"success": True, "message": "Images added successfully", "image_urls": uploaded_urls}, 201


class ListingSearch(Resource):
    def get(self):
        query = Listing.query
        location = request.args.get('location')
        if location:
            query = query.filter(or_(
                Listing.city.ilike(f'%{location}%'), Listing.state.ilike(f'%{location}%'),
                Listing.pincode.ilike(f'%{location}%'), Listing.street_address.ilike(f'%{location}%')
            ))
        min_rent = request.args.get('min_rent', type=float)
        if min_rent is not None: query = query.filter(Listing.monthlyRent >= min_rent)
        max_rent = request.args.get('max_rent', type=float)
        if max_rent is not None: query = query.filter(Listing.monthlyRent <= max_rent)
        keyword = request.args.get('keyword')
        if keyword: query = query.filter(or_(Listing.title.ilike(f'%{keyword}%'), Listing.description.ilike(f'%{keyword}%')))
        amenities_str = request.args.get('amenities')
        if amenities_str:
            required_amenities = [amenity.strip() for amenity in amenities_str.split(',')]
            for amenity in required_amenities:
                search_pattern = f'%"{amenity}"%'
                query = query.filter(cast(Listing.amenities, String).ilike(search_pattern))
        sort_by = request.args.get('sort_by')
        if sort_by == 'rent_asc': query = query.order_by(Listing.monthlyRent.asc())
        elif sort_by == 'rent_desc': query = query.order_by(Listing.monthlyRent.desc())
        
        filtered_listings = query.all()
        
        result = [serialize_listing_full_detail(l) for l in filtered_listings]
        return {"success": True, "count": len(result), "data": result}


class ReviewCreate(Resource):
    @jwt_required()
    def post(self, listing_id):
        user_id = int(get_jwt_identity())
        data = request.get_json()
        rating = data.get('rating')
        comment = data.get('comment')

        if rating is None: return {"success": False, "message": "Rating is a required field"}, 400
        try:
            rating_int = int(rating)
            if not (1 <= rating_int <= 5):
                return {"success": False, "message": "Rating must be an integer between 1 and 5"}, 400
        except (ValueError, TypeError):
            return {"success": False, "message": "Rating must be a valid integer"}, 400

        completed_booking = Booking.query.filter(
            Booking.user_id == user_id, 
            Booking.listing_id == listing_id,
            Booking.status == 'Confirmed', 
            Booking.appointment_date < date.today()
        ).first()
        if not completed_booking:
            return {"success": False, "message": "You can only review after a completed appointment."}, 403

        if Review.query.filter_by(user_id=user_id, listing_id=listing_id).first():
            return {"success": False, "message": "You have already reviewed this listing."}, 409

        new_review = Review(
            rating=rating_int, comment=comment, user_id=user_id, listing_id=listing_id
        )
        db.session.add(new_review)
        db.session.commit()

        review_data = {
            "id": new_review.id, "author_username": new_review.author.username,
            "rating": new_review.rating, "comment": new_review.comment,
            "created_at": new_review.created_at.isoformat()
        }
        
        return {"success": True, "data": review_data, "message": "Review submitted successfully"}, 201


api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingResource, "/listings/<int:listing_id>")
api.add_resource(ListingImageUpload, "/listings/<int:listing_id>/images")
api.add_resource(ListingSearch, "/listings/search")
api.add_resource(ReviewCreate, "/listings/<int:listing_id>/reviews")
