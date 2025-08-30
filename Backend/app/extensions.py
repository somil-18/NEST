from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from argon2 import PasswordHasher


db = SQLAlchemy()
mail = Mail()
jwt = JWTManager()
cors = CORS()
ph = PasswordHasher()