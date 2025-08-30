from flask import url_for, current_app
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired


def send_verification_email(mail, email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps(email, salt='email-confirm')

    link = url_for('auth.confirm_email', token=token, _external=True)
    
    msg = Message("Confirm Your Email", recipients=[email])
    msg.body = f'Your confirmation link is {link}'
    mail.send(msg)


def confirm_email_token(token, expiration=3600):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])

    try:
        email = s.loads(token, salt='email-confirm', max_age=expiration)
    except SignatureExpired:
        return None
    return email


def send_password_reset_email(mail, email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps(email, salt='password-reset')

    link = url_for('auth.resetpassword', token=token, _external=True)
    
    msg = Message("Password Reset Request", recipients=[email])
    msg.body = f'To reset your password, visit the following link: {link}'
    mail.send(msg)


def confirm_password_reset_token(token, expiration=3600):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    
    try:
        email = s.loads(token, salt='password-reset', max_age=expiration)
    except SignatureExpired:
        return None

    return email
