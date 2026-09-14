# 🏡 NEST — Modern Real Estate & Rental Property Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT_Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

**NEST** is a full-stack real estate and rental property discovery platform connecting property owners and prospective tenants. It features a responsive React 19 user interface styled with Tailwind CSS and Radix UI, backed by a Flask RESTful API with PostgreSQL, Argon2 password hashing, JWT token authentication, email verification, and Cloudinary media management.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env)](#frontend-env)
- [API Overview](#-api-overview)
- [Scripts Reference](#-scripts-reference)
- [License](#-license)

---

## 🚀 Features

### 👤 For Tenants / Users
- **Browse & Search Listings:** Explore available apartments, houses, and rooms with interactive search and live filters (by city, state, pincode, price range, bedrooms, bathrooms, seating, and furnishing).
- **Property Details & Image Carousel:** High-res gallery sliders powered by Swiper, full amenity breakdowns, location details, pricing, and owner info.
- **Viewing Appointments:** Book in-person visits and viewing appointments with owners directly through the platform.
- **Favorites / Wishlist:** Save preferred listings to personal favorites for quick access.
- **Reviews & Ratings:** Submit verified reviews and star ratings on visited properties.
- **User Profile:** Manage profile details, contact information, and viewing requests.

### 🏢 For Property Owners
- **Owner Dashboard:** Centralized management hub tracking active properties, booking inquiries, and viewing requests.
- **Listing Management:** Add new listings with multi-image Cloudinary uploads, custom descriptions, amenities, and pricing.
- **Edit & Update Listings:** Real-time updates for property details, availability status, and media.
- **Inquiry & Booking Tracking:** Review incoming tenant appointment requests.

### 🛡️ Authentication & Security
- **Argon2 Password Hashing:** State-of-the-art password security.
- **Dual JWT Tokens:** Secure short-lived access tokens and refresh tokens with token blocklisting upon logout.
- **Email Verification & Password Reset:** Tokenized verification emails and password reset flows using Flask-Mail.
- **Role-Based Access Control (RBAC):** Distinct routes and permissions for `user` and `owner` roles.

---

## 🛠️ Architecture & Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Core UI component library |
| **Vite 7** | Next-generation build tool and dev server |
| **Tailwind CSS v4** | Modern utility-first styling engine |
| **Radix UI** | Accessible, unstyled primitives (Dialogs, Tabs, Avatars, Selects) |
| **React Router v7** | Client-side declarative routing and protected routes |
| **Axios** | HTTP client for REST API communication |
| **Formik + Yup** | Robust form handling and schema validation |
| **Lucide React** | Lightweight iconography |
| **Sonner** | Toast notifications |
| **Swiper** | Touch-friendly image carousel slider |

### Backend
| Technology | Description |
| :--- | :--- |
| **Python 3.11+** | Backend runtime environment |
| **Flask 3.x** | Core web framework |
| **Flask-RESTful** | REST API routing and resource management |
| **Flask-SQLAlchemy** | SQLAlchemy ORM for database models and relationships |
| **Flask-JWT-Extended** | JWT token generation, refresh, and blocklist verification |
| **Flask-Mail** | SMTP email client for verification and password reset |
| **Flask-Cors** | Cross-Origin Resource Sharing handling |
| **Argon2-cffi** | Password hashing |
| **Cloudinary SDK** | Cloud storage for property and profile image uploads |
| **Gunicorn** | Production WSGI HTTP server |
| **PostgreSQL** | Primary relational database (supports SQLite for local dev) |

---

## 📂 Repository Structure

```
NEST/
├── Backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication, register, login, verification, password reset
│   │   │   ├── bookings.py      # Property viewing appointments
│   │   │   ├── favorites.py     # User wishlist / favorite listings
│   │   │   ├── listings.py      # CRUD for property listings, filtering, reviews
│   │   │   └── owner.py         # Owner dashboard metrics and property management
│   │   ├── utils/               # Helper utilities & validators
│   │   ├── extensions.py        # Flask extension instances (db, jwt, mail, cors)
│   │   ├── models.py            # SQLAlchemy database models (User, Listing, Booking, Review)
│   │   └── __init__.py          # Flask application factory
│   ├── config.py                # Configuration loader from environment variables
│   ├── requirements.txt         # Python package dependencies
│   ├── run.py                   # Development entry point
│   ├── .env.example             # Sample environment variables for backend
│   └── README.md                # Comprehensive REST API documentation
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components & dialogs
│   │   ├── contexts/            # React contexts (AuthContext)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # Public, User, and Owner layouts
│   │   ├── pages/
│   │   │   ├── auth/            # Login & Register views
│   │   │   ├── forgot_password/ # Password reset request and confirmation
│   │   │   ├── owner/           # Owner dashboard & Add/Edit listing views
│   │   │   ├── public/          # Home, Listings, ListingDetail, About, Contact
│   │   │   ├── user/            # Profile and Favorites views
│   │   │   └── verification/    # Email verification landing page
│   │   ├── utils/               # Constants, API helpers, color themes
│   │   ├── yup/                 # Validation schemas
│   │   ├── App.jsx              # Application router setup
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind CSS root stylesheet
│   ├── package.json             # NPM package scripts and dependencies
│   ├── vite.config.js           # Vite configuration
│   └── .env.example             # Sample environment variables for frontend
├── .gitignore                   # Root gitignore
└── README.md                    # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v18.x or higher) & **npm** (v9.x or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** instance running locally or hosted (e.g. Supabase, Render, Neon), or SQLite

---

### 1. Backend Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Create and activate a Python virtual environment:**
   - On Windows (PowerShell):
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS / Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Copy the example file and update with your credentials:
   ```bash
   cp .env.example .env
   ```
   *(See [Backend (.env)](#backend-env) for required values).*

5. **Start the Backend server:**
   ```bash
   python run.py
   ```
   The Flask API will run on `http://localhost:5000`. Database tables will be automatically created on startup.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the example file:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_URL` to your backend address:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   The frontend app will be accessible at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `SECRET_KEY` | Flask application session secret | `your-secret-key` |
| `SQLALCHEMY_DATABASE_URI` | Database connection string | `postgresql://postgres:password@localhost:5432/nest_db` |
| `JWT_SECRET_KEY` | Secret key used for signing JWT tokens | `your-jwt-secret-key` |
| `MAIL_USERNAME` | SMTP Email address for outgoing mail | `noreply@yourdomain.com` |
| `MAIL_PASSWORD` | SMTP password / App password | `your-app-password` |
| `FRONTEND_URL` | Frontend origin permitted by CORS | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary account cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY`   | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret | `your_api_secret` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend Flask API | `http://localhost:5000` |

---

## 📡 API Overview

A complete, detailed endpoint-by-endpoint reference is available in [`Backend/README.md`](Backend/README.md).

### Summary of Key Endpoints:

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/register` | `POST` | Register a new user (`user` or `owner` role) |
| | `/login` | `POST` | Authenticate and obtain JWT access & refresh tokens |
| | `/refresh` | `POST` | Refresh expired access token |
| | `/logout` | `POST` | Invalidate active token via blocklist |
| | `/verify-email/<token>` | `GET` | Verify email address |
| | `/forgot-password` | `POST` | Request password reset email |
| | `/reset-password/<token>` | `POST` | Update password using reset token |
| **Listings** | `/listings` | `GET` | Search and filter listings with pagination |
| | `/listings/<id>` | `GET` | Get listing details |
| | `/listings` | `POST` | Create property listing (Owner only) |
| | `/listings/<id>` | `PUT` | Update property listing (Owner only) |
| | `/listings/<id>` | `DELETE` | Delete property listing (Owner only) |
| | `/listings/<id>/reviews` | `POST` | Add review and rating for listing |
| **Bookings** | `/bookings` | `POST` | Schedule viewing appointment |
| | `/bookings/user` | `GET` | Retrieve user's appointments |
| | `/bookings/<id>` | `DELETE`| Cancel appointment |
| **Favorites**| `/favorites` | `GET` | Retrieve logged-in user's favorites |
| | `/favorites/<listing_id>` | `POST` | Add listing to favorites |
| | `/favorites/<listing_id>` | `DELETE`| Remove listing from favorites |
| **Owner** | `/owner/dashboard` | `GET` | Owner analytics, listings, and bookings |

---

## 💻 Scripts Reference

### Frontend (`frontend/`)
- `npm run dev` — Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` — Builds the production bundle into the `dist/` directory.
- `npm run preview` — Locally previews the production build.
- `npm run lint` — Runs ESLint checks across the codebase.

### Backend (`Backend/`)
- `python run.py` — Runs the Flask development server on `localhost:5000` with debug mode.
- `gunicorn run:app` — Starts the production WSGI server.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.