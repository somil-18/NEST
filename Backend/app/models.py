from .extensions import db
from sqlalchemy.dialects.mysql import JSON


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(20))
    bio = db.Column(db.Text, nullable=True)
    mobile_no = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    age = db.Column(db.Integer, nullable=True)

    listings = db.relationship('Listing', backref='owner', lazy=True, cascade="all, delete-orphan")
    bookings = db.relationship('Booking', backref='tenant', lazy=True, cascade="all, delete-orphan")


class Listing(db.Model):
    __tablename__ = 'listing'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    amenities = db.Column(JSON)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    bookings = db.relationship('Booking', backref='listing', lazy=True, cascade="all, delete-orphan")


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)   
    listing_id = db.Column(db.Integer, db.ForeignKey("listing.id"), nullable=False)   
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default="Pending")  # Pending, Confirmed, Cancelled
    created_at = db.Column(db.DateTime, server_default=db.func.now())


# stores revoked JWT tokens to prevent their reuse
class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)