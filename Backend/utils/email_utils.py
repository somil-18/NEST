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
