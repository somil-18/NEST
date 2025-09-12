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


def serialize_owner(owner):
    if not owner: return None
    return {
        "id": owner.id, "username": owner.username, "mobile_no": owner.mobile_no,
        "gender": owner.gender, "age": owner.age
    }

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
        "created_at": listing.created_at.isoformat() if listing.created_at else None,
        "image_urls": listing.image_urls or [], "owner": serialize_owner(listing.owner)
    }

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

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024 # 5 MB

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
        
       # check pid
        pid = data.get('pid')

        # only check for uniqueness IF a pid was provided
        if pid:
            if Listing.query.filter_by(pid=pid).first():
                return {"success": False, "message": "Property ID is already in use."}, 409
        
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
        
        return {"success": True, "data": serialize_listing_full_detail(listing), "message": "Listing created successfully"}, 201


class ListingList(Resource):
    @jwt_required(optional=True)  # authentication optional
    def get(self):
        today = date.today()
        listings = Listing.query.all()
        result = []
        featured_listings = []

        current_user_id = get_jwt_identity()

        for l in listings:
            status = "Available" # default status

            # check for a personal booking if a user is logged in
            if current_user_id:
                user_has_booking = Booking.query.filter(
                    Booking.user_id == current_user_id,
                    Booking.listing_id == l.id,
                    Booking.status.in_(['Confirmed', 'Pending'])
                ).first()
                if user_has_booking:
                    status = "Booked"

            # if not personally booked, check for general availability
            if status == "Available":
                total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
                    Booking.listing_id == l.id,
                    cast(Booking.created_at, Date) == today, 
                    Booking.status.in_(['Confirmed', 'Pending'])
                ).scalar() or 0

                if l.seating is not None and total_attendees_today >= l.seating:
                    status = "Booked"

            review_stats = db.session.query(
                func.avg(Review.rating), func.count(Review.id)
            ).filter(Review.listing_id == l.id).first()
            avg_rating, review_count = review_stats or (None, 0)
            
            listing_data = serialize_listing_for_list_view(l, status, avg_rating, review_count)
            result.append(listing_data)
            
            if avg_rating and avg_rating >= 4.0:
                featured_listings.append(listing_data)

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
        listing = Listing.query.get_or_404(listing_id)
        today = date.today()

        total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id == listing.id,
            cast(Booking.created_at, Date) == today, 
            Booking.status.in_(['Confirmed', 'Pending'])
        ).scalar() or 0
        status = "Booked" if listing.seating is not None and total_attendees_today >= listing.seating else "Available"

        review_stats = db.session.query(
            func.avg(Review.rating), func.count(Review.id)
        ).filter(Review.listing_id == listing.id).first()
        avg_rating, review_count = review_stats or (None, 0)
        
        listing_data = serialize_listing_for_list_view(listing, status, avg_rating, review_count)

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
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id)
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        data = {}
        is_gallery_replacement = False

        if 'data' in request.form or 'images' in request.files: 
            if 'data' in request.form:
                try:
                    data = json.loads(request.form['data'])
                    if 'image_urls' in data:
                        is_gallery_replacement = True
                        listing.image_urls = data['image_urls'] 
                except json.JSONDecodeError:
                    return {"success": False, "message": "Invalid JSON in 'data' field"}, 400
            
            # handle image uploads
            if 'images' in request.files:
                files = request.files.getlist('images')
                if files and files[0].filename != '':
                    uploaded_urls = []
                    for file in files:
                        if not allowed_file(file.filename): return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
                        try:
                            upload_result = cloudinary.uploader.upload(file)
                            uploaded_urls.append(upload_result['secure_url'])
                        except Exception as e:
                            return {"success": False, "message": f"Image upload failed: {str(e)}"}, 500
                    
                    if not is_gallery_replacement:
                        if listing.image_urls is None: listing.image_urls = []
                        listing.image_urls.extend(uploaded_urls)
                    else:
                        listing.image_urls.extend(uploaded_urls)
        else: 
            data = request.get_json()
            if data is None:
                return {"success": False, "message": "Invalid JSON or no data provided"}, 400
        
        for field in ['title', 'description', 'street_address', 'city', 'state', 'pincode', 'propertyType', 
                'monthlyRent', 'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'area', 
                'furnishing', 'amenities']:
            if field in data:
                if field != 'image_urls':
                    setattr(listing, field, data[field])

        if 'amenities' in data:
            flag_modified(listing, "amenities")
        if is_gallery_replacement or ('images' in request.files and request.files.getlist('images')[0].filename != ''):
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

        # filter by specific fields 
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
                query = query.filter(func.json_contains(Listing.amenities, f'"{amenity}"'))

        keyword = request.args.get('keyword')
        if keyword:
            query = query.filter(or_(
                Listing.title.ilike(f'%{keyword}%'), 
                Listing.description.ilike(f'%{keyword}%'),
                Listing.pid.ilike(f'%{keyword}%'),
                Listing.ownerName.ilike(f'%{keyword}%') 
            ))

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
            Booking.status == 'Confirmed'
            # cast(Booking.created_at, Date) < date.today() 
        ).first()

        if not completed_booking:
            return {"success": False, "message": "You can only review listings after a completed, past appointment."}, 403

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
        current_user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")

        if listing.owner_id != current_user_id:
            return {"success": False, "message": "Unauthorized: You can only verify your own listings."}, 403

        data = request.get_json()
        is_verified_status = data.get('is_verified')

        if is_verified_status is None or not isinstance(is_verified_status, bool):
            return {"success": False, "message": "Request body must include 'is_verified' as a boolean (true or false)."}, 400

        listing.is_verified = is_verified_status
        db.session.commit()

        return ListingResource().get(listing_id)


api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingResource, "/listings/<int:listing_id>")
api.add_resource(ListingImageUpload, "/listings/<int:listing_id>/images")
api.add_resource(ListingSearch, "/listings/search")
api.add_resource(ReviewCreate, "/listings/<int:listing_id>/reviews")

api.add_resource(ListingVerification, "/listings/<int:listing_id>/verify")









