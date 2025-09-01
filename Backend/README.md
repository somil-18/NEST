
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

```
Validation Rules
username: Required, must be unique.

email: Required, must be a valid format and unique.

mobile_no: Required, must be a 10-digit Indian number starting with 6, 7, 8, or 9.

password: Required. Must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character.

role: Required. Must be either "user" or "owner".
```

**Response:**
- `201 Created` – Check your email for verification link.
- `400 Bad request` – Missing fields or invalid data format.
- `409 Conflict` – Username or email already taken.

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

- `201 Created` – Check your email for verification link.
**Response:**
```json
{
  "success": true,
  "access_token": "string",
  "refresh_token": "string",
  "role": "user or owner"
}
```
- `401 Unauthorized` – Invalid credentials.
- `403 Forbidden` – User's email not verified.

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
- `400 Bad request` – Missing fields or password doesn't match pattern complexicity
- `401 Unauthorized` – Old password is incorrect.

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
  "message": "If an account with that email exists, a reset link has been sent."
}
```
- `400 Bad request` – Valid email is required.

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
- `404 Not foung` – User not found.
- `400 Bad request` – New password does not meet complexity requirements or expired token

---
### 7. Fetch user profile

**Endpoint:** `GET /profile`  
**Description:** Fetches the complete profile info. for currety aunthenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "username": "testuser",
        "email": "test@example.com",
        "role": "user",
        "bio": "Software developer from Mumbai.",
        "mobile_no": "9876543210",
        "address": "123 Marine Drive, Mumbai, India",
        "gender": "Male",
        "age": 28
    }
}
```

**Error**
```json
{
    "success": false,
    "message": "User not found"
}
```
---

### 8. Update user profile

**Endpoint:** `PATCH /profile`  
**Description:** Updates one or more fields of the user's profile. 

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
    "username": "new_username", // unique
    "bio": "Updated bio.",
    "mobile_no": "9988776655", // 10 digit, start from 6-9
    "address": "New Address, Pune",
    "gender": "Female", // male or female
    "age": 30, // betweem 18-100
    "image_url": "http:/cloudinary" // profile picture
}
```

**Response:**
```json
{
    "success": true,
    "message": "Profile updated successfully"
}
```

**Error**
```json
{
    "success": false,
    "message": "Invalid mobile number format"
}
```
---

### 8. Delete user profile

**Endpoint:** `DELETE /profile`  
**Description:** Permanently deletes the user's account and all associated data (listings, bookings). This action also immediately invalidates the user's current access token, logging them out securely. 

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "success": true,
    "message": "Account deleted. You have been logged out."
}
```

**Error**
```json
{
    "success": false,
    "message": "User not found"
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
    "title": "2 BHK Apartment",
    "description": "A beautiful, fully furnished apartment with a great view.", //optional
    "street_address": "123 Dreamvilla Rd",
    "city": "Solan",
    "state": "Himachal Pradesh",
    "pincode": "173212",
    "propertyType": "Apartment",
    "monthlyRent": 15000,
    "securityDeposit": 5000,
    "bedrooms": 2,
    "bathrooms": 2,
    "seating": 4,
    "area": "1200 sqft", // optional
    "furnishing": "Fully-Furnished", //optional
    "amenities": ["Wifi", "Geyser", "TV", "Air Conditioning"]
}
```

**Response:**
```json
{
    "success": true,
    "data": {
    "title": "2 BHK Apartment",
    "description": "A beautiful, fully furnished apartment with a great view.",
    "street_address": "123 Dreamvilla Rd",
    "city": "Solan",
    "state": "Himachal Pradesh",
    "pincode": "173212",
    "propertyType": "Apartment",
    "monthlyRent": 15000,
    "securityDeposit": 5000,
    "bedrooms": 2,
    "bathrooms": 2,
    "seating": 4,
    "area": "1200 sqft",
    "furnishing": "Fully-Furnished",
    "amenities": ["Wifi", "Geyser", "TV", "Air Conditioning"]
},
    "message": "Listing created successfully"
}
```
- `400 Bad Request:` Missing or invalid data/files.

- `403 Forbidden:` User is not an "owner".
---

### 2. Get All Listings (Public)

**Endpoint:** `GET /listings`  

**Response:**
```json
{
  "success": true,
  "data": [
    {
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "2 BHK Apartment",
            // ... all listing fields
            "owner": {
                "id": 1,
                "username": "Somil",
                "mobile_no": "9876543210",
                "gender": "Male",
                "age": 30
            },
            "availability_status": "Available"
        }
    ]
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
    "success": true,
    "data": {
        "id": 1,
        "title": "2 BHK Apartment",
        // ... all listing fields
        "owner": {   "id": 1,
                "username": "Somil",
                "mobile_no": "9876543210",
                "gender": "Male",
                "age": 30},
    }
}
,
  "message": "Listing updated successfully"
}
```

- `404 Not Found:` Listing with the given ID does not exist.
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

### 5. Search & Filter

**Endpoint:** `GET /listings/search`  
**Description:** A powerful endpoint to search, filter, and sort listings based on multiple criteria. 

```
PARAMETERS

location --> Solan --> Case-insensitive search across city, state, pincode, and street.

min_rent --> 10000 --> Filters for listings with monthly rent greater than or equal to this value.

max_rent --> 20000 --> Filters for listings with monthly rent less than or equal to this value.

keyword --> furnished --> Case-insensitive search in the listing's title and description.

amenities --> Wifi,TV --> Comma-separated list. Finds listings that have ALL specified amenities.

sort_by --> rent_asc or rent_desc --> Sorts the results by monthly rent.
```

**Response:**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "id": 1,
            "title": "2 BHK Apartment",
            // ... all listing fields with nested owner
        }
    ]
}

```

---
### 5. Review & ratings

**Endpoint:** `POST /listings/<listing_id>/reviews`  
**Description:** A user can only post a review if they have a past, confirmed appointment for that specific listing. A user can only review a listing once. 

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
    "rating": 5,
    "comment": "The owner was very helpful and the place was clean!"
}
```

**Response Body (JSON):**
- `201 Created:` Success. Returns the newly created review object.
- `400 Bad Request:` Rating is missing or not between 1 and 5.
- `403 Forbidden:` User does not have a completed appointment for this listing.
- `409 Conflict:` User has already reviewed this listing.

---
## Booking Endpoints

### 1. Create booking (User)

**Endpoint:** `POST /bookings/create`  
**description** Schedules a viewing appointment for a specific listing on a given date. The number of attendees is checked against the listing's daily capacity.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (JSON):**
```json
{
    "listing_id": 1,
    "appointment_date": "2025-09-15",
    "attendees": 2
}
```

**Response:**
- `201 Created:` Success. Returns the newly created review object.
```json
{
  "success": true,
    "data": {
      "id": 1,
        "appointment_date": "2025-09-15",
        "attendees": 2,
        "status": "Pending",
        "listing": {
          "id": 1,
            "title": "2 BHK Apartment",
            "street_address": "123 Dreamvilla Rd",
            "city": "Solan",
            "state": "Himachal Pradesh",
            "main_image_url": "[https://res.cloudinary.com/](https://res.cloudinary.com/)..."
        },
        "tenant": {
          "id": 2,
            "username": "testuser",
            "mobile_no": "9876543210"
        }
    },
    "message": "Appointment scheduled, awaiting confirmation"
}
```
- ``400 Bad Request:`` Missing fields or invalid data format.

- ``403 Forbidden:`` User is trying to book their own listing.

- ``404 Not Found:`` listing_id does not exist.

- ``409 Conflict:`` The listing does not have enough capacity for the requested number of attendees on that day.

---

### 2. My bookings (User)

**Endpoint:** `GET /bookings/my`  
**Description:** Returns all bookings by this tenant with status info.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "appointment_date": "2025-08-02",
            "attendees": 2,
            "status": "Confirmed",
            "listing": {
                "id": 2,
                "title": "2 BHK",
                "street_address": "Near Dreamvilla",
                "city": "Solan",
                "state": "Himachal Pradesh",
                "main_image_url": "https://res.cloudinary.com/dwyabk2ek/image/upload/v1756751831/gwhtvfwnwb9iu0sefdbi.jpg"
            }
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
            "id": 2,
            "appointment_date": "2025-08-02",
            "attendees": 2,
            "status": "pending",
            "listing": {
                "id": 2,
                "title": "2 BHK",
                "street_address": "Near Dreamvilla",
                "city": "Solan",
                "state": "Himachal Pradesh",
                "main_image_url": "https://res.cloudinary.com/dwyabk2ek/image/upload/v1756751831/gwhtvfwnwb9iu0sefdbi.jpg"
            },
            "tenant": {
                "id": 2,
                "username": "Yash",
                "mobile_no": "8123456789",
                "gender": null,
                "age": null
            }
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
  "status": "Confirmed" // confirmed or cancelled
}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "appointment_date": "2025-08-02",
            "attendees": 2,
            "status": "confiremd",
            "listing": {
                "id": 2,
                "title": "2 BHK",
                "street_address": "Near Dreamvilla",
                "city": "Solan",
                "state": "Himachal Pradesh",
                "main_image_url": "https://res.cloudinary.com/dwyabk2ek/image/upload/v1756751831/gwhtvfwnwb9iu0sefdbi.jpg"
            },
            "tenant": {
                "id": 2,
                "username": "Yash",
                "mobile_no": "8123456789",
                "gender": null,
                "age": null
            }
        }
    ]
}
```

- ``200 OK:`` Success. Returns the full, updated appointment object.
- ``400 Bad Request:`` status field is missing or invalid.
- ``403 Forbidden:`` The logged-in user does not own the listing associated with this appointment.
- ``404 Not Found:`` booking_id does not exist.

3.2 Cancel an Appointment (User)

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

- ``204 No Content:`` Success. The response body will be empty.
- ``403 Forbidden:`` The logged-in user did not create this appointment.
- ``404 Not Found:`` booking_id does not exist.

---

## Favorites
### 1. Get favorites

**Endpoint:** `GET /favorites`  
**Description:** Fetches a list of all listings that the currently logged-in user has added to their favorites.


**Headers:**
```
Authorization: Bearer <access_token>
```

- ``200 OK:`` Success. Returns an array of summary listing objects.
**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "2 BHK Apartment",
            "monthlyRent": 15000.0,
            "city": "Solan",
            "state": "Himachal Pradesh",
            "main_image_url": "[https://res.cloudinary.com/](https://res.cloudinary.com/)..."
        }
    ]
}
```

- ``401 Unauthorized:`` Token is missing or invalid.
- ``404 Not Found:`` The logged-in user does not exist.

---

### 2. Add a listing favorites

**Endpoint:** `POST /favorites/<listing_id>`  
**Description:** Adds a specific listing to the currently logged-in user's favorites list.


**Headers:**
```
Authorization: Bearer <access_token>
```

- ``200 OK:`` Success. Returns an array of summary listing objects.
**Response:**
```json
{
    "success": true,
    "message": "Listing added to favorites"
}

```

- ``401 Unauthorized:`` Token is missing or invalid.
- ``404 Not Found:`` The logged-in user does not exist.
- ``409 Conflict:`` The user has already favorited this listing.

---

### 3. Removing a listing from favorites  

**Endpoint:** `DELETE /favorites/<listing_id>`  
**Description:** Removes a specific listing from the currently logged-in user's favorites list.


**Headers:**
```
Authorization: Bearer <access_token>
```

- ``204 No Content:`` Success. The response body will be empty.

- ``401 Unauthorized:`` Token is missing or invalid.

- ``404 Not Found:`` The specified listing_id is not in the user's favorites, or the user/listing does not exist.

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

| Column      | Type          | Constraints       |
|-------------|---------------|-------------------|
| id          | Integer       | Primary Key       |
| username    | String(50)    | Unique, Not Null  |
| email       | String(254)   | Unique, Not Null  |
| password    | String(200)   | Not Null          |
| is_verified | Boolean       | Default False     |
| role        | String(20)    | Default 'user'    |

### Listing Table

| Column      | Type          | Constraints                       |
|-------------|---------------|-----------------------------------|
| id          | Integer       | Primary Key                       |
| title       | String(200)   | Not Null                          |
| description | Text          | Nullable                          |
| price       | Float         | Not Null                          |
| location    | String(200)   | Not Null                          |
| owner_id    | Integer       | Foreign Key to User.id, Not Null  |

### Booking Table

| Column      | Type        | Constraints                      |
|-------------|-------------|----------------------------------|
| id          | Integer     | Primary Key, Auto-incrementing   |
| user_id     | Integer     | Foreign key → User.id            |
| listing_id  | Integer     | Foreign key → Listing.id         |
| start_date  | Date        | Booking start date               |
| end_date    | Date        | Booking end date                 |
| status      | String(20)  | Pending/Confirmed/Cancelled      |
| created_at  | DateTime    | Auto timestamp                   |

### Review Table

| Column      | Type          | Constraints                                |
|-------------|---------------|--------------------------------------------|
| id          | Integer       | Primary Key, Auto-incrementing             |
| rating         | Integer    | Required (Not Null) |
| comment  | Text    | Optional (Nullable) |
| user_id  | Integer      | Foreign Key → user.id, Required, Indexed |
| listing_id  | Integer     | Foreign Key → listing.id, Required, Indexed |
| created_at  | DateTime      | AAuto-timestamp (Server Default) |

### Favorites Association Table
- This is a simple "junction" table that exists only to create a bridge between users and listings. It has no extra data, only the two IDs required to link them.

| Column      | Type          | Constraints                                |
|-------------|---------------|--------------------------------------------|
| user_id          | Integer       | Composite Primary Key, Foreign Key → user.id           |
| listing_id       | Integer   | Composite Primary Key, Foreign Key → listing.id  |

### TokenBlockList Table

| Column      | Type          | Constraints                                |
|-------------|---------------|--------------------------------------------|
| id          | Integer       | Primary Key, Auto-incrementing             |
| jti         | String(36)    | JWT's Unique ID, Indexed for fast lookups  |
| created_at  | DateTime      | Auto timestamp of when the token was added |


**Relationships:**  
- Each `Listing` belongs to a `Owner`.  
- A `Owner` can have multiple `Listings`.  
- Each Booking must belong to one `User`.
- Each Booking must be for one Listing.
- A `User` can have multiple Bookings.
- A Listing can have multiple Bookings.
- Each Review belongs to one User (the author). A single User can write many reviews for different listings.
- Each Review belongs to one Listing. A single Listing can have many reviews from different users.
- A User can have many favorite Listings.
- A Listing can be favorited by many Users.
---
