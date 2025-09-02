from .extensions import db
# from sqlalchemy.dialects.mysql import JSON
from sqlalchemy import func, JSON 


# This is our junction table for the many-to-many relationship.
favorites_association_table = db.Table('favorites_association',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('listing_id', db.Integer, db.ForeignKey('listing.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    mobile_no = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    bio = db.Column(db.Text, nullable=True)
    address = db.Column(db.Text, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    profile_image_url = db.Column(db.String(255), nullable=True)
    
    listings = db.relationship('Listing', backref='owner', lazy=True, cascade="all, delete-orphan")
    bookings = db.relationship('Booking', backref='tenant', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='author', lazy=True, cascade="all, delete-orphan")

    favorites = db.relationship(
        'Listing', 
        secondary=favorites_association_table,
        backref=db.backref('favorited_by', lazy='dynamic')
    )


class Listing(db.Model):
    __tablename__ = 'listing'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    street_address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False, index=True)
    pincode = db.Column(db.String(10), nullable=False, index=True)
    monthlyRent = db.Column(db.Float, nullable=False, index=True)
    securityDeposit = db.Column(db.Float, nullable=False)
    propertyType = db.Column(db.String(50), nullable=False, index=True)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    seating = db.Column(db.Integer, nullable=False)
    area = db.Column(db.String(50), nullable=True)
    furnishing = db.Column(db.String(50), nullable=True)
    amenities = db.Column(JSON)
    image_urls = db.Column(db.JSON, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)

    bookings = db.relationship('Booking', backref='listing', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='listing_reviewed', lazy=True, cascade="all, delete-orphan")


class Booking(db.Model):
    __tablename__ = 'booking'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)   
    listing_id = db.Column(db.Integer, db.ForeignKey("listing.id"), nullable=False, index=True) 
    appointment_date = db.Column(db.Date, nullable=False, index=True)
    attendees = db.Column(db.Integer, nullable=False, default=1)

    status = db.Column(db.String(20), default="Pending")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class Review(db.Model):
    __tablename__ = 'review'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    listing_id = db.Column(db.Integer, db.ForeignKey("listing.id"), nullable=False, index=True)
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # a nique constraint to prevent a user from reviewing the same listing multiple times.
    __table_args__ = (db.UniqueConstraint('user_id', 'listing_id', name='_user_listing_uc'),)


class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())


