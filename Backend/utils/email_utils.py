from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from flask import current_app, url_for


def send_verification_email(mail, email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps(email, salt="email-confirm")
    link = url_for('confirm_email', token=token, _external=True)

    msg = Message("Email Verification", recipients=[email])
    msg.body = f"Click the link to verify your email: {link}"
    mail.send(msg)


def confirm_email_token(token, max_age=3600):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        return s.loads(token, salt="email-confirm", max_age=max_age)
    except Exception:
        return None


def send_password_reset_email(mail, email):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps(email, salt="password-reset-salt")
    link = url_for('resetpassword', token=token, _external=True)

    msg = Message("Password Reset", recipients=[email])
    msg.body = f"Click the link to reset your password: {link}"
    mail.send(msg)


def confirm_password_reset_token(token, max_age=900):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        return s.loads(token, salt="password-reset-salt", max_age=max_age)
    except Exception:
        return None
