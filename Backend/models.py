from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import JSON

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(20), default="user") 


class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    amenities = db.Column(JSON)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    owner = db.relationship("User", backref=db.backref("listings", lazy=True))


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)   
    listing_id = db.Column(db.Integer, db.ForeignKey("listing.id"), nullable=False)  
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default="Pending")  # Pending, Confirmed, Cancelled
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
