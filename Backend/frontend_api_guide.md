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
  "role": "user" // optional, default is "user". Use "owner" if the user can create listings
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
  "description": "string", // optional
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
    "price": 1000,
    "location": "...",
    "owner_id": 1
  },
  "message": "Listing created successfully"
}
```

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
      "location": "..."
    }
  ],
  "message": "Listings fetched successfully"
}
```

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
    "title": "...",
    "description": "...",
    "price": 1200,
    "location": "...",
    "owner_id": 1
  },
  "message": "Listing updated successfully"
}
```

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

## Email Verification

After registering, the user will receive an email with a verification link:

```
GET /confirm/<token>
```

Once verified, the user can log in.

---

## Database Models

### User Table

| Column      | Type       | Constraints                     |
|------------|-------------|---------------------------------|
| id         | Integer     | Primary Key                      |
| username   | String(50)  | Unique, Not Null                  |
| email      | String(254) | Unique, Not Null                  |
| password   | String(200) | Not Null                          |
| is_verified| Boolean     | Default False                     |
| role       | String(20)  | Default 'user'                    |

### Listing Table

| Column      | Type    | Constraints                     |
|------------|---------|---------------------------------|
| id         | Integer | Primary Key                      |
| title      | String(200)  | Not Null                          |
| description| Text    | Nullable                          |
| price      | Float   | Not Null                          |
| location   | String(200) | Not Null                          |
| owner_id   | Integer | Foreign Key to User.id, Not Null |

**Relationships:**
- Each `Listing` belongs to a `User` (owner).
- A `User` can have multiple `Listings`.

---

