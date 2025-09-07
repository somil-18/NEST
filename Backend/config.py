import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    

    # database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    

    # JWT configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    # JWT_ACCESS_TOKEN_EXPIRES = False
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_BLOCKLIST_ENABLED = True
    JWT_BLOCKLIST_TOKEN_CHECKS = ['access', 'refresh']
    

    # mail configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME")
    

    # frontend URL for CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL")


