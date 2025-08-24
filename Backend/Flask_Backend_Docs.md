
# Flask Backend API Documentation

This backend is built using **Flask** and provides user authentication, email verification, and secure routes.  
It exposes APIs for **registration, login, token refresh, and protected resources**.  

Your React frontend will consume these APIs.

---

## 🚀 Project Overview

The backend does the following:
1. **Registers users** with username, email, password, and role.
2. Sends **email verification links** after registration.
3. **Logs in users** using username/email + password.
4. Uses **JWT tokens** (Access & Refresh) for authentication.
5. Provides **protected routes** that require a valid token.

---

## 📂 Project Structure

```
flask-backend/
│
├── app.py                # Main backend file, defines routes and resources
├── config.py             # App configuration (database, mail, JWT secrets)
├── .env                  # Secret keys, DB URL, email credentials
├── models.py             # Database model (User table)
├── utils/
│   └── email_utils.py    # Email verification functions
```

---

## ⚙️ Setup & Running the App

1. **Install dependencies**
   ```bash
   pip install flask flask-restful flask-jwt-extended flask-mail flask-cors argon2-cffi python-dotenv flask-sqlalchemy pymysql itsdangerous
   ```

2. **Create `.env` file**  
   Example:
   ```
   SECRET_KEY=SUPERSECRETKEY
   JWT_SECRET_KEY=JWTSECRET
   SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:password@localhost/f_db?charset=utf8mb4
   MAIL_USERNAME=your_gmail@gmail.com
   MAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run the app**
   ```bash
   python app.py
   ```
   The backend will start on **http://127.0.0.1:5000**

---

## 🗄 Database Structure

We use **SQLAlchemy** ORM with MySQL as the database.

### User Table Fields:

| Field       | Type               | Length | Description                                  |
|-------------|--------------------|--------|----------------------------------------------|
| id          | Integer (Primary)   | -      | Auto-incremented unique ID                    |
| username    | String              | 50     | Unique username for login                     |
| email       | String              | 254    | Unique email for login and verification       |
| password    | String              | 200    | Hashed password using Argon2                  |
| is_verified | Boolean             | -      | True if email is verified                     |
| role        | String              | 20     | Role type (e.g., user, admin)                 |

**Key Points:**
- **username** max length = 50 characters  
- **email** max length = 254 characters (standard email length)  
- **password** stored in hash form, max length = 200  
- **role** default = "user" unless specified  

---

## 🛠 API Endpoints

### 1️⃣ User Registration
**Endpoint:**  
```
POST /register
```

**Request Body (JSON):**
```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "mypassword",
  "role": "user"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Check email for verification link"
}
```

---

### 2️⃣ Email Verification
**Endpoint:**  
```
GET /confirm/<token>
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### 3️⃣ User Login
**Endpoint:**  
```
POST /login
```

**Request Body (JSON):**
```json
{
  "username": "john123",
  "password": "mypassword"
}
```

**Response (Success):**
```json
{
  "success": true,
  "access_token": "JWT_ACCESS_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN",
  "role": "user"
}
```

---

### 4️⃣ Refresh Access Token
**Endpoint:**  
```
POST /refresh
```

**Headers:**
```
Authorization: Bearer <REFRESH_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "access_token": "NEW_JWT_ACCESS_TOKEN"
}
```

---

### 5️⃣ Protected Route
**Endpoint:**  
```
GET /secure
```

**Headers:**
```
Authorization: Bearer <ACCESS_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Hello user 1"
}
```

---

## 🔐 Token Details
- **Access Token**: Short-lived (30 min). Used for normal requests.
- **Refresh Token**: Long-lived. Used to get new access tokens.

---

## 📧 Email Verification Flow
1. User registers → Email sent with verification link.
2. User clicks link → Email verified in DB.
3. User can now log in.

---

## ✅ Summary of Endpoints

| Method | Endpoint         | Description                   | Auth Required |
|--------|------------------|-------------------------------|---------------|
| POST   | /register         | Register a new user           | No            |
| GET    | /confirm/<token>  | Verify user email             | No            |
| POST   | /login            | Login and get tokens          | No            |
| POST   | /refresh          | Refresh access token          | Yes (refresh) |
| GET    | /secure           | Test protected route          | Yes (access)  |

---
