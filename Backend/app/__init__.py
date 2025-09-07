# import os
# import cloudinary
# from flask import Flask
# from config import Config
# from .extensions import db, mail, jwt, cors


# def create_app(config_class=Config):
#     app = Flask(__name__)
#     app.config.from_object(config_class)

    
#     # initialize extensions
#     db.init_app(app)
#     mail.init_app(app)
#     jwt.init_app(app)
#     cors.init_app(app, resources={r"/*": {"origins": app.config.get('FRONTEND_URL')}}, supports_credentials=True)

    
#     # configure Cloudinary
#     cloudinary.config(
#         cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
#         api_key=os.getenv('CLOUDINARY_API_KEY'),
#         api_secret=os.getenv('CLOUDINARY_API_SECRET'),
#         secure=True
#     )

    
#     # import and register blueprints
#     from .routes.auth import auth_bp
#     from .routes.listings import listings_bp
#     from .routes.bookings import bookings_bp
#     from .routes.owner import owner_bp
#     from .routes.favorites import favorites_bp
    

#     app.register_blueprint(auth_bp)
#     app.register_blueprint(listings_bp)
#     app.register_blueprint(bookings_bp)
#     app.register_blueprint(owner_bp)
#     app.register_blueprint(favorites_bp)
    

    
#     with app.app_context():
#         db.create_all()


#     return app
import os
import cloudinary
from flask import Flask
from config import Config
from .extensions import db, mail, jwt, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": app.config.get('FRONTEND_URL')}}, supports_credentials=True)

    # --- THIS IS THE NEW, CRITICAL ADDITION ---
    # This is a special function that tells our app how to respond
    # whenever it encounters an expired token.
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        """
        Returns a consistent JSON response when an access token has expired.
        """
        return {
            "success": False,
            "message": "Token has expired",
            "error": "token_expired"
        }, 401
    # -------------------------------------------

    # Configure Cloudinary
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True
    )

    # Import and register blueprints
    from .routes.auth import auth_bp
    from .routes.listings import listings_bp
    from .routes.bookings import bookings_bp
    from .routes.favorites import favorites_bp
    from .routes.owner import owner_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(listings_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(owner_bp)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app


