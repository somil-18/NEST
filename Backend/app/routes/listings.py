
import os
import json
from datetime import date
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, cast, String, func, Date
from sqlalchemy.orm.attributes import flag_modified
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
        "pid": listing.pid, "ownerName": listing.ownerName, "is_verified": listing.is_verified,
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
        required_fields = ['title', 'street_address', 'city', 'state', 'pincode', 'propertyType', 'monthlyRent', 'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'area', 'furnishing', 'amenities']
        if not all(field in data for field in required_fields): return {"success": False, "message": "Missing required fields"}, 400
        if 'images' not in request.files or not request.files.getlist('images') or request.files.getlist('images')[0].filename == '':
            return {"success": False, "message": "At least one image is required."}, 400
        # Check if PID is already taken 
        if Listing.query.filter_by(pid=data['pid']).first():
            return {"success": False, "message": "Property ID (pid) is already in use."}, 409
        
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
        """
        Fetches all listings and adds a correct, real-time availability status for today
        by using the 'created_at' timestamp for bookings.
        """
        today = date.today()
        listings = Listing.query.all()
        result = []
        featured_listings = []

        # We loop through each listing to get its individual, accurate status.
        for l in listings:
            # --- THIS IS THE CORRECTED QUERY ---
            # It now uses `cast(Booking.created_at, Date)` to get just the date part
            # of the timestamp for the comparison.
            total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
                Booking.listing_id == l.id,
                cast(Booking.created_at, Date) == today, # <-- The Fix
                Booking.status.in_(['Confirmed', 'Pending'])
            ).scalar() or 0

            # Determine the availability status based on capacity.
            status = "Booked" if l.seating is not None and total_attendees_today >= l.seating else "Available"
            
            # --- We also need the review stats for the 'featured' logic ---
            review_stats = db.session.query(
                func.avg(Review.rating), func.count(Review.id)
            ).filter(Review.listing_id == l.id).first()
            avg_rating, review_count = review_stats or (None, 0)
            
            # Use your full serializer to format the data
            listing_data = serialize_listing_for_list_view(l, status, avg_rating, review_count)
            result.append(listing_data)
            
            # Check if this listing should be featured
            if avg_rating and avg_rating >= 4.0:
                featured_listings.append(listing_data)

        # Sort the featured list by rating (highest first) and limit to top 5
        featured_listings.sort(key=lambda x: x.get('average_rating') or 0, reverse=True)
        
        return {
            "success": True, 
            "data": {
                "featured": featured_listings[:5],
                "all_listings": result
            }
        }

class ListingResource(Resource):
    def get(self, listing_id):
        """
        Fetches a single listing's complete details, including its real-time status,
        average rating, review count, and all of its reviews.
        """
        listing = Listing.query.get_or_404(listing_id)
        today = date.today()

        # --- THIS IS THE CORRECTED LOGIC ---
        # 1. Calculate availability status for today using `created_at`.
        total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id == listing.id,
            cast(Booking.created_at, Date) == today, # <-- The Fix
            Booking.status.in_(['Confirmed', 'Pending'])
        ).scalar() or 0
        status = "Booked" if listing.seating is not None and total_attendees_today >= listing.seating else "Available"

        # 2. Calculate the average rating and review count.
        review_stats = db.session.query(
            func.avg(Review.rating), func.count(Review.id)
        ).filter(Review.listing_id == listing.id).first()
        avg_rating, review_count = review_stats or (None, 0)
        # ---------------------------------

        # Now, call the serializer that accepts all the calculated arguments.
        listing_data = serialize_listing_for_list_view(listing, status, avg_rating, review_count)

        # Fetch and add the full list of reviews.
        reviews_data = []
        for review in listing.reviews:
            reviews_data.append({
                "id": review.id, "author_username": review.author.username,
                "rating": review.rating, "comment": review.comment,
                "created_at": review.created_at.isoformat()
            })
        listing_data["reviews"] = reviews_data
        
        return {"success": True, "data": listing_data}
    
    @jwt_required()
    def patch(self, listing_id):
        """
        Updates a listing with flexible logic for text, adding images, or replacing images.
        """
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id)
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        data = {}
        # --- NEW: This flag tells us if the frontend wants to replace the image gallery ---
        is_gallery_replacement = False

        # --- Flexible logic to handle both request types ---
        if 'data' in request.form or 'images' in request.files: # Multipart request
            # Handle text data if present
            if 'data' in request.form:
                try:
                    data = json.loads(request.form['data'])
                    # Check if the frontend sent a final list of URLs
                    if 'image_urls' in data:
                        is_gallery_replacement = True
                        listing.image_urls = data['image_urls'] # Start with this list
                except json.JSONDecodeError:
                    return {"success": False, "message": "Invalid JSON in 'data' field"}, 400
            
            # Handle image uploads
            if 'images' in request.files:
                files = request.files.getlist('images')
                if files and files[0].filename != '':
                    uploaded_urls = []
                    for file in files:
                        # (Your image validation logic is perfect here)
                        if not allowed_file(file.filename): return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
                        # ... (add file size check here if you want)
                        try:
                            upload_result = cloudinary.uploader.upload(file)
                            uploaded_urls.append(upload_result['secure_url'])
                        except Exception as e:
                            return {"success": False, "message": f"Image upload failed: {str(e)}"}, 500
                    
                    # If it's not a replacement, append. Otherwise, add to the replacement list.
                    if not is_gallery_replacement:
                        if listing.image_urls is None: listing.image_urls = []
                        listing.image_urls.extend(uploaded_urls)
                    else:
                        listing.image_urls.extend(uploaded_urls)
        else: # JSON-only request (no files)
            data = request.get_json()
            if data is None:
                return {"success": False, "message": "Invalid JSON or no data provided"}, 400
        
        # --- Update loop for all text fields ---
        for field in ['title', 'description', 'street_address', 'city', 'state', 'pincode', 'propertyType', 
                'monthlyRent', 'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'area', 
                'furnishing', 'amenities']:
            if field in data:
                # The 'image_urls' are handled above, so we skip them here.
                if field != 'image_urls':
                    setattr(listing, field, data[field])
        
        # Manually flag JSON fields if they were part of the update.
        if 'amenities' in data:
            flag_modified(listing, "amenities")
        # Flag image_urls if they were replaced OR if new images were appended
        if is_gallery_replacement or ('images' in request.files and request.files.getlist('images')[0].filename != ''):
            flag_modified(listing, "image_urls")

        db.session.commit()
        return self.get(listing_id) # Return the full, updated listing
    
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
        """
        Searches, filters, and sorts listings based on query parameters.
        Now includes searching by 'pid' and 'ownerName'.
        """
        query = Listing.query

        # --- Filter by specific fields ---
        pid = request.args.get('pid')
        if pid:
            query = query.filter(Listing.pid.ilike(f'%{pid}%'))

        owner_name = request.args.get('ownerName')
        if owner_name:
            query = query.filter(Listing.ownerName.ilike(f'%{owner_name}%'))

        location = request.args.get('location')
        if location:
            query = query.filter(or_(
                Listing.city.ilike(f'%{location}%'), 
                Listing.state.ilike(f'%{location}%'),
                Listing.pincode.ilike(f'%{location}%'), 
                Listing.street_address.ilike(f'%{location}%')
            ))

        min_rent = request.args.get('min_rent', type=float)
        if min_rent is not None:
            query = query.filter(Listing.monthlyRent >= min_rent)
        
        max_rent = request.args.get('max_rent', type=float)
        if max_rent is not None:
            query = query.filter(Listing.monthlyRent <= max_rent)

        amenities_str = request.args.get('amenities')
        if amenities_str:
            required_amenities = [amenity.strip() for amenity in amenities_str.split(',')]
            for amenity in required_amenities:
                # Use JSON_CONTAINS for a robust, case-sensitive search in MySQL/PostgreSQL
                # Note: This is a more advanced and reliable method than the previous ilike trick.
                query = query.filter(func.json_contains(Listing.amenities, f'"{amenity}"'))

        # --- A "smart" keyword search that checks multiple relevant fields ---
        keyword = request.args.get('keyword')
        if keyword:
            query = query.filter(or_(
                Listing.title.ilike(f'%{keyword}%'), 
                Listing.description.ilike(f'%{keyword}%'),
                Listing.pid.ilike(f'%{keyword}%'), # <-- ADDED
                Listing.ownerName.ilike(f'%{keyword}%') # <-- ADDED
            ))

        # --- Sorting logic (no changes here) ---
        sort_by = request.args.get('sort_by')
        if sort_by == 'rent_asc':
            query = query.order_by(Listing.monthlyRent.asc())
        elif sort_by == 'rent_desc':
            query = query.order_by(Listing.monthlyRent.desc())
        
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

        # Robust validation for the rating
        if rating is None: return {"success": False, "message": "Rating is a required field"}, 400
        try:
            rating_int = int(rating)
            if not (1 <= rating_int <= 5):
                return {"success": False, "message": "Rating must be an integer between 1 and 5"}, 400
        except (ValueError, TypeError):
            return {"success": False, "message": "Rating must be a valid integer"}, 400

        # --- THIS IS THE CORRECTED SECURITY CHECK ---
        # It now uses `cast(Booking.created_at, Date)` to get just the date part
        # of the timestamp for a correct comparison.
        completed_booking = Booking.query.filter(
            Booking.user_id == user_id, 
            Booking.listing_id == listing_id,
            Booking.status == 'Confirmed', 
            cast(Booking.created_at, Date) < date.today() # <-- The Fix
        ).first()

        if not completed_booking:
            return {"success": False, "message": "You can only review listings after a completed, past appointment."}, 403

        # This check prevents a user from reviewing the same listing twice.
        if Review.query.filter_by(user_id=user_id, listing_id=listing_id).first():
            return {"success": False, "message": "You have already submitted a review for this listing."}, 409

        new_review = Review(
            rating=rating_int,
            comment=comment, 
            user_id=user_id, 
            listing_id=listing_id
        )
        db.session.add(new_review)
        db.session.commit()

        review_data = {
            "id": new_review.id, 
            "author_username": new_review.author.username,
            "rating": new_review.rating, 
            "comment": new_review.comment,
            "created_at": new_review.created_at.isoformat()
        }
        
        return {"success": True, "data": review_data, "message": "Review submitted successfully"}, 201
    

class ListingVerification(Resource):
    @jwt_required()
    def patch(self, listing_id):
        """
        Allows an owner to manually verify or un-verify their own listing.
        """
        # Step 1: Security Check - Is the current user the owner of this listing?
        current_user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")

        if listing.owner_id != current_user_id:
            return {"success": False, "message": "Unauthorized: You can only verify your own listings."}, 403

        # Step 2: Get the new verification status from the request body
        data = request.get_json()
        is_verified_status = data.get('is_verified')

        # Step 3: Validate the input
        if is_verified_status is None or not isinstance(is_verified_status, bool):
            return {"success": False, "message": "Request body must include 'is_verified' as a boolean (true or false)."}, 400

        # Step 4: Find the listing and update its status
        listing.is_verified = is_verified_status
        db.session.commit()

        # Step 5: Return the full, updated listing object to confirm the change
        # We can reuse the get method from ListingResource to get the full, updated data.
        return ListingResource().get(listing_id)


api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingResource, "/listings/<int:listing_id>")
api.add_resource(ListingImageUpload, "/listings/<int:listing_id>/images")
api.add_resource(ListingSearch, "/listings/search")
api.add_resource(ReviewCreate, "/listings/<int:listing_id>/reviews")

api.add_resource(ListingVerification, "/listings/<int:listing_id>/verify")




