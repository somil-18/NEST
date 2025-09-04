import os
import cloudinary
from flask import Flask
from config import Config
from .extensions import db, mail, jwt, cors


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    
    # initialize extensions
    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": app.config.get('FRONTEND_URL')}}, supports_credentials=True)

    
    # configure Cloudinary
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True
    )

    
    # import and register blueprints
    from .routes.auth import auth_bp
    from .routes.listings import listings_bp
    from .routes.bookings import bookings_bp
    from .routes.favorites import favorites_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(listings_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(favorites_bp)

    
    with app.app_context():
        db.create_all()


    return app
