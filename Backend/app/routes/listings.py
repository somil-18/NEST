import os
import json
from datetime import date
from flask import request, Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, cast, String, func
from sqlalchemy.orm.attributes import flag_modified 
import cloudinary.uploader


from ..extensions import db
from ..models import User, Listing, Booking, Review

listings_bp = Blueprint('listings', __name__)
api = Api(listings_bp)


# owner summary
def serialize_owner(owner):
    if not owner: return None
    return {
        "id": owner.id, "username": owner.username, "mobile_no": owner.mobile_no,
        "gender": owner.gender, "age": owner.age
    }

# listings
def serialize_listing_summary(listing, status, avg_rating, review_count):
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
        "owner": serialize_owner(listing.owner),
        "availability_status": status,
        "average_rating": round(float(avg_rating), 2) if avg_rating else None,
        "review_count": review_count or 0
    }

# image allowed extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# create listings
class ListingCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user or user.role.lower() != "owner":
            return {"success": False, "message": "Unauthorized: Only owners can create listings"}, 403

        # data validation
        if 'data' not in request.form:
            return {"success": False, "message": "Missing 'data' field in form"}, 400
        try:
            data = json.loads(request.form['data'])
        except json.JSONDecodeError:
            return {"success": False, "message": "Invalid JSON format in 'data' field"}, 400

        required_fields = [
            'title', 'street_address', 'city', 'state', 'pincode', 'propertyType',
            'monthlyRent', 'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'amenities'
        ]
        if not all(field in data for field in required_fields):
            return {"success": False, "message": "Missing required fields in 'data' JSON"}, 400

        # image validation 
        if 'images' not in request.files:
            return {"success": False, "message": "No images part in the request. At least one image is required."}, 400

        files = request.files.getlist('images')

        if not files or files[0].filename == '':
            return {"success": False, "message": "No files selected. At least one image is required."}, 400

        uploaded_urls = []
        for file in files:
            if not allowed_file(file.filename):
                return {"success": False, "message": f"Invalid file type: {file.filename}. Please upload only images."}, 400
            try:
                upload_result = cloudinary.uploader.upload(file)
                uploaded_urls.append(upload_result['secure_url'])
            except Exception as e:
                return {"success": False, "message": f"Image upload failed: {str(e)}"}, 500
        
        listing = Listing(
            owner_id=user_id, image_urls=uploaded_urls, **data
        )
        
        db.session.add(listing)
        db.session.commit()
        
        listing_data = {
            "id": listing.id,
            "title": listing.title,
            "monthlyRent": listing.monthlyRent,
            "city": listing.city,
            "state": listing.state
        }
        
        return {"success": True, "data": listing_data, "message": "Listing created successfully"}, 201


# view listings (public)
class ListingList(Resource):
    def get(self):
        today = date.today()
        
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
            
            listing_summary = serialize_listing_summary(listing, status, avg_rating, review_count)
            
            all_listings.append(listing_summary)

            # a listing is "featured" if it has an average rating of 4.0 or higher.
            if avg_rating and avg_rating >= 4.0:
                featured_listings.append(listing_summary)

        # sort the featured list by rating (highest first) and limit to top 5
        featured_listings.sort(key=lambda x: x['average_rating'] or 0, reverse=True)
        
        return {
            "success": True, 
            "data": {
                "featured": featured_listings[:5], # return only the top 5 featured
                "all_listings": all_listings
            }
        }


# update or delete listings
class ListingResource(Resource):
    def get(self, listing_id):
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        today = date.today()

        # calculate the real-time availability status for today
        total_attendees_today = db.session.query(func.sum(Booking.attendees)).filter(
            Booking.listing_id == listing.id,
            Booking.appointment_date == today,
            Booking.status.in_(['Confirmed', 'Pending'])
        ).scalar() or 0
        
        status = "Booked" if listing.seating is not None and total_attendees_today >= listing.seating else "Available"

        # calculate the average rating and review count
        review_stats = db.session.query(
            func.avg(Review.rating),
            func.count(Review.id)
        ).filter(Review.listing_id == listing.id).first()
        
        avg_rating, review_count = review_stats or (None, 0)
        
        # srialize the main listing data, now including the calculated fields
        listing_data = {
            "id": listing.id, "title": listing.title, "description": listing.description,
            "street_address": listing.street_address, "city": listing.city, "state": listing.state, "pincode": listing.pincode,
            "propertyType": listing.propertyType, "monthlyRent": listing.monthlyRent, "securityDeposit": listing.securityDeposit,
            "bedrooms": listing.bedrooms, "bathrooms": listing.bathrooms, "seating": listing.seating,
            "area": listing.area, "furnishing": listing.furnishing, "amenities": listing.amenities or [],
            "image_urls": listing.image_urls or [], "owner": serialize_owner(listing.owner),
            "availability_status": status,
            "average_rating": round(float(avg_rating), 2) if avg_rating else None,
            "review_count": review_count
        }

        # fetch and serialize all reviews for this listing (this part is correct)
        reviews_data = []
        for review in listing.reviews:
            reviews_data.append({
                "id": review.id,
                "author_username": review.author.username,
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at.isoformat()
            })
        
        listing_data["reviews"] = reviews_data
        
        return {"success": True, "data": listing_data}
    
    @jwt_required()
    def patch(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        if listing.owner_id != user_id:
            return {"success": False, "message": "Unauthorized"}, 403

        data = request.get_json()

        # Loop through all possible fields that can be updated
        for field in ['title', 'description', 'street_address', 'city', 'state', 'pincode', 'propertyType', 
                      'monthlyRent', 'securityDeposit', 'bedrooms', 'bathrooms', 'seating', 'area', 
                      'furnishing', 'amenities']:
            
            if field in data:
                if field == 'amenities':
                    # special handling for amenities to append and avoid duplicates.
                    existing_amenities = set(listing.amenities or [])
                    new_amenities = set(data[field]) # Use set to handle duplicates in the input
                    
                    # combine the two sets, automatically handles duplicates.
                    combined_amenities = existing_amenities.union(new_amenities)
                    
                    listing.amenities = list(combined_amenities)
                    
                    # tell the database that this JSON field has been modified in place.
                    flag_modified(listing, "amenities")
                else:
                    # for all other fields, a direct replacement
                    setattr(listing, field, data[field])
        
        db.session.commit()
        return self.get(listing_id) # Return the full, updated listing

    @jwt_required()
    def delete(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        if listing.owner_id != user_id: return {"success": False, "message": "Unauthorized"}, 403
        db.session.delete(listing)
        db.session.commit()
        return {"success": True, "message": "Listing deleted successfully"}, 200


# upload more images
class ListingImageUpload(Resource):
    @jwt_required()
    def post(self, listing_id):
        user_id = int(get_jwt_identity())
        listing = Listing.query.get_or_404(listing_id, description="Listing not found")
        if listing.owner_id != user_id: return {"success": False, "message": "Unauthorized"}, 403
        if 'images' not in request.files: return {"success": False, "message": "No 'images' key found"}, 400
        files = request.files.getlist('images')
        if not files or files[0].filename == '': return {"success": False, "message": "No files selected"}, 400

        uploaded_urls = []
        try:
            for file in files:
                # validations
                if not allowed_file(file.filename):
                    return {"success": False, "message": f"Invalid file type: {file.filename}."}, 400
                upload_result = cloudinary.uploader.upload(file)
                uploaded_urls.append(upload_result['secure_url'])
        except Exception as e:
            return {"success": False, "message": f"Image upload failed: {str(e)}"}, 500

        if listing.image_urls is None: listing.image_urls = []
        listing.image_urls.extend(uploaded_urls)
        flag_modified(listing, "image_urls")
        db.session.commit()
        return {"success": True, "message": "Images added successfully", "image_urls": uploaded_urls}, 201


# search & filter
class ListingSearch(Resource):
    def get(self):
        query = Listing.query
        location = request.args.get('location')
        
        # location
        if location:
            query = query.filter(or_(
                Listing.city.ilike(f'%{location}%'), Listing.state.ilike(f'%{location}%'),
                Listing.pincode.ilike(f'%{location}%'), Listing.street_address.ilike(f'%{location}%')
            ))
            
        # min and max rent
        min_rent = request.args.get('min_rent', type=float)
        if min_rent is not None: query = query.filter(Listing.monthlyRent >= min_rent)
        max_rent = request.args.get('max_rent', type=float)
        if max_rent is not None: query = query.filter(Listing.monthlyRent <= max_rent)

        # keywords in description
        keyword = request.args.get('keyword')
        if keyword: query = query.filter(or_(Listing.title.ilike(f'%{keyword}%'), Listing.description.ilike(f'%{keyword}%')))
        amenities_str = request.args.get('amenities')

        # amenities
        if amenities_str:
            required_amenities = [amenity.strip() for amenity in amenities_str.split(',')]
            for amenity in required_amenities:
                search_pattern = f'%"{amenity}"%'
                query = query.filter(cast(Listing.amenities, String).ilike(search_pattern))
                
        # sort by rent in asc or desc
        sort_by = request.args.get('sort_by')
        if sort_by == 'rent_asc': query = query.order_by(Listing.monthlyRent.asc())
        elif sort_by == 'rent_desc': query = query.order_by(Listing.monthlyRent.desc())
        
        filtered_listings = query.all()
        
        result = [{
            "id": l.id, "title": l.title, "description": l.description,
            "street_address": l.street_address, "city": l.city, "state": l.state, "pincode": l.pincode,
            "propertyType": l.propertyType, "monthlyRent": l.monthlyRent, "securityDeposit": l.securityDeposit,
            "bedrooms": l.bedrooms, "bathrooms": l.bathrooms, "seating": l.seating,
            "area": l.area, "furnishing": l.furnishing, "amenities": l.amenities or [],
            "image_urls": l.image_urls or [], "owner": serialize_owner(l.owner)
        } for l in filtered_listings]
        return {"success": True, "count": len(result), "data": result}


# listings review
class ReviewCreate(Resource):
    @jwt_required()
    def post(self, listing_id):
        user_id = int(get_jwt_identity())
        data = request.get_json()
        rating = data.get('rating')
        comment = data.get('comment')

        if rating is None:
            return {"success": False, "message": "Rating is a required field"}, 400

        # validations
        try:
            rating_int = int(rating)
            if not (1 <= rating_int <= 5):
                return {"success": False, "message": "Rating must be an integer between 1 and 5"}, 400
        except (ValueError, TypeError):
            return {"success": False, "message": "Rating must be a valid integer"}, 400

        # checking if a user is eligible for reviews or not
        completed_booking = Booking.query.filter(
            Booking.user_id == user_id, 
            Booking.listing_id == listing_id,
            Booking.status == 'Confirmed', 
            Booking.appointment_date < date.today()
        ).first()
        if not completed_booking:
            return {"success": False, "message": "You can only review listings after a completed appointment."}, 403

        # this check prevents a user from reviewing the same listing twice
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


api.add_resource(ListingCreate, "/listings/create")
api.add_resource(ListingList, "/listings")
api.add_resource(ListingResource, "/listings/<int:listing_id>")

api.add_resource(ListingImageUpload, "/listings/<int:listing_id>/images")

api.add_resource(ListingSearch, "/listings/search")

api.add_resource(ReviewCreate, "/listings/<int:listing_id>/reviews")












