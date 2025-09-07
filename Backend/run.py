from dotenv import load_dotenv
from flask_cors import CORS
import os


load_dotenv()


from app import create_app, db


app = create_app()
CORS(app)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

