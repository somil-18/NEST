
# Backend API Documentation

---

## Base URL

```
http://localhost:5000
```

---

## Authentication Endpoints

### 1. Register a New User

**Endpoint:** `POST /register`  
**Description:** Create a new user account.

**Request Body (JSON):**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string" // user or owner
}
```

**Response:**
- `201 Created` – Check your email for verification link.
- `400` – Missing fields or username/email already taken.

---

### 2. Login

**Endpoint:** `POST /login`  
**Description:** Log in and get JWT tokens.

**Request Body (JSON):**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "string",
  "refresh_token": "string",
  "role": "user or owner"
}
```

---

### 3. Refresh Token

**Endpoint:** `POST /refresh`  
**Description:** Get a new access token using the refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response:**
```json
{
  "success": true,
  "access_token": "string"
}
```

---

### 4. Change Password

**Endpoint:** `POST /change-password`  
**Description:** Allows a logged-in user to securely update their password.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
  "old_password": "string",
  "new_password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### 5. Forgot Password

**Endpoint:** `POST /forgot-password`  
**Description:** Request a password reset link via email.

**Request Body (JSON):**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email."
}
```

---

### 6. Reset Password

**Endpoint:** `POST /reset-password/<token>`  
**Description:** Reset password using token sent on email.

**Request Body (JSON):**
```json
{
  "new_password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## Listings Endpoints

### 1. Create a Listing (Owner Only)

**Endpoint:** `POST /listings/create`  
**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
  "title": "string",
  "description": "string",
  "amenities": ["Wifi", "Geyser", "Bed"],
  "price": 1000,
  "location": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "...",
    "description": "...",
    "amenities": ["Wifi", "Geyser", "Bed"],
    "price": 1000,
    "location": "...",
    "owner_id": 1
  },
  "message": "Listing created successfully"
}
```

---

### 2. Get All Listings (Public)

**Endpoint:** `GET /listings`  

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "...",
      "price": 1000,
      "amenities": ["Wifi", "Geyser", "Bed"],
      "location": "..."
    }
  ],
  "message": "Listings fetched successfully"
}
```

---

### 3. Update a Listing (Owner Only)

**Endpoint:** `PUT /listings/<listing_id>`  
**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
  "title": "new title",
  "description": "new description",
  "price": 1200,
  "location": "new location"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "new title",
    "description": "new description",
    "amenities": ["Wifi", "Geyser", "Bed"],
    "price": 1200,
    "location": "new location",
    "owner_id": 1
  },
  "message": "Listing updated successfully"
}
```

---

### 4. Delete a Listing (Owner Only)

**Endpoint:** `DELETE /listings/<listing_id>`  
**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": 1,
  "message": "Listing deleted successfully"
}
```

---
## Booking Endpoints

### 1. Create booking (User)

**Endpoint:** `POST /bookings/create`  

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
  "listing_id": 1,
  "start_date": "2025-09-01",
  "end_date": "2025-09-05"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 10,
    "listing_id": 1,
    "user_id": 7,
    "start_date": "2025-09-01",
    "end_date": "2025-09-05",
    "status": "Pending" // by default "pending"
  }
}
```

---

### 2. My bookings (User)

**Endpoint:** `GET /bookings/my`  
**Description:**Returns all bookings by this tenant with status info.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "listing_id": 1,
      "title": "Cozy Apartment",
      "location": "New Delhi",
      "start_date": "2025-09-01",
      "end_date": "2025-09-05",
      "status": "Pending"
    }
  ]
}
```

---

### 3. Owner bookings

**Endpoint:** `GET /bookings/owner`  
**Description:** Fetches all bookings for listings owned by that owner.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "listing_id": 1,
      "user_id": 7,
      "title": "Cozy Apartment",
      "location": "New Delhi",
      "start_date": "2025-09-01",
      "end_date": "2025-09-05",
      "status": "Pending"
    }
  ]
}
```

---

### 4. Update booking status (Owner Only)

**Endpoint:** `POST /bookings/<booking_id>`  
**Description:** Verifies owner owns that listing and owner can update status "Confirmed" or "Cancelled"


**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
  "status": "Confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "id": 10,
    "listing_id": 1,
    "user_id": 7,
    "start_date": "2025-09-01",
    "end_date": "2025-09-05",
    "status": "Confirmed"
  }
}
```

### 5. Cancel booking (User)

**Endpoint:** `DELETE /bookings/<booking_id>/cancel`  
**Description:** Deletes booking if not confirmed yet (or you can allow even after confirmation).


**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled"
}
```
---

## Email Verification

After registering, the user will receive an email with a verification link:

```
GET /confirm/<token>
```

Once verified, the user can log in.

---

## Database Models

### User Table

| Column      | Type         | Constraints                     |
|-------------|--------------|----------------------------------|
| id          | Integer       | Primary Key                      |
| username    | String(50)    | Unique, Not Null                  |
| email       | String(254)   | Unique, Not Null                  |
| password    | String(200)   | Not Null                          |
| is_verified | Boolean       | Default False                     |
| role        | String(20)    | Default 'user'                    |

### Listing Table

| Column      | Type         | Constraints                           |
|-------------|--------------|---------------------------------------|
| id          | Integer       | Primary Key                           |
| title       | String(200)   | Not Null                              |
| description | Text          | Nullable                              |
| price       | Float         | Not Null                              |
| location    | String(200)   | Not Null                              |
| owner_id    | Integer       | Foreign Key to User.id, Not Null       |

### Booking Table

| Column      | Type         | Constraints                           |
|-------------|--------------|---------------------------------------|
| id          | Integer       | Primary Key                           |
| user_id       | Integer   | Foreign key → User.id                           |
| listing_id | Integer        | Foreign key → Listing.id                           |
| start_date     | Date         | Booking start date                            |
| end_date   | Date   | Booking end date                             |
| status   | String(20)    | Pending/Confirmed/Cancelled     |
| created_at   | DateTime | Auto timestamp       |

**Relationships:**  
- Each `Listing` belongs to a `User` (owner).  
- A `User` can have multiple `Listings`.  

---
