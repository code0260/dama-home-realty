# 📚 API Documentation

# توثيق API

## Base URL

```
http://localhost:8000/api
```

---

## Authentication

### Register

```http
POST /api/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Login

```http
POST /api/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!",
  "remember": false
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Logout

```http
POST /api/logout
```

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User

```http
GET /api/user
```

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Properties

### List Properties

```http
GET /api/properties
```

**Query Parameters:**

- `type` - Filter by type (sale, rent, hotel)
- `min_price` - Minimum price
- `max_price` - Maximum price
- `neighborhood_id` - Filter by neighborhood
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms
- `featured` - Show only featured (true/false)
- `verified` - Show only verified (true/false)
- `search` - Search in title/description
- `status` - Filter by status (active, sold, rented)
- `per_page` - Items per page (default: 15, max: 100)
- `page` - Page number

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "uuid": "...",
      "slug": "luxury-apartment-malki",
      "title": "Luxury Apartment in Malki",
      "price": 50000,
      "currency": "USD",
      "type": "sale",
      "bedrooms": 3,
      "bathrooms": 2,
      "area_sqm": 150,
      "is_featured": true,
      "is_verified": true,
      "neighborhood": {
        "id": 1,
        "name": "Malki"
      },
      "agent": {
        "id": 1,
        "name": "Ahmad Ali",
        "photo": "...",
        "phone": "+963..."
      }
    }
  ],
  "current_page": 1,
  "last_page": 5,
  "per_page": 15,
  "total": 75
}
```

### Get Property by Slug/UUID

```http
GET /api/properties/{identifier}
```

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "uuid": "...",
    "slug": "luxury-apartment-malki",
    "title": "Luxury Apartment in Malki",
    "description": "...",
    "price": 50000,
    "currency": "USD",
    "type": "sale",
    "bedrooms": 3,
    "bathrooms": 2,
    "area_sqm": 150,
    "amenities": ["WiFi", "Parking", "AC"],
    "images": ["image1.jpg", "image2.jpg"],
    "neighborhood": {...},
    "agent": {...}
  }
}
```

### Get Property Availability

```http
GET /api/properties/{identifier}/availability
```

**Response (200):**

```json
{
  "success": true,
  "message": "Availability retrieved successfully",
  "data": {
    "property_id": 1,
    "blocked_dates": ["2025-02-15", "2025-02-16"],
    "available": false
  }
}
```

---

## Bookings

### List Bookings

```http
GET /api/bookings
```

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `property_id` - Filter by property
- `booking_status` - Filter by status
- `payment_status` - Filter by payment status
- `per_page` - Items per page
- `page` - Page number

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "property_id": 1,
      "check_in": "2025-02-01",
      "check_out": "2025-02-05",
      "total_price": 2000,
      "amount_paid": 600,
      "payment_status": "partial",
      "booking_status": "confirmed",
      "property": {...},
      "user": {...}
    }
  ]
}
```

### Create Booking

```http
POST /api/bookings
```

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "property_id": 1,
  "check_in": "2025-02-01",
  "check_out": "2025-02-05",
  "notes": "Special requests"
}
```

**Response (201):**

```json
{
  "data": {
    "id": 1,
    "property_id": 1,
    "check_in": "2025-02-01",
    "check_out": "2025-02-05",
    "total_price": 2000,
    "payment_status": "pending",
    "booking_status": "pending"
  }
}
```

### Get Booking

```http
GET /api/bookings/{id}
```

**Headers:**

```
Authorization: Bearer {token}
```

### Update Booking (Admin Only)

```http
PUT /api/bookings/{id}
```

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "booking_status": "confirmed",
  "payment_status": "paid",
  "amount_paid": 2000,
  "notes": "Payment received"
}
```

### Delete Booking (Admin Only)

```http
DELETE /api/bookings/{id}
```

**Headers:**

```
Authorization: Bearer {token}
```

---

## Leads

### Create Lead

```http
POST /api/leads
```

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+963123456789",
  "message": "I'm interested in this property",
  "property_id": 1,
  "type": "inquiry",
  "preferred_date": "2025-02-15",
  "preferred_time": "10:00 AM"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Thank you for your interest! We will contact you within 24 hours.",
  "data": {
    "lead": {
      "id": 1,
      "name": "John Doe",
      "phone": "+963123456789",
      "status": "new",
      "type": "inquiry"
    }
  }
}
```

### Get My Services (Authenticated)

```http
GET /api/my-services
```

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "phone": "+963123456789",
      "type": "service_request",
      "status": "new"
    }
  ]
}
```

---

## Services

### List Services

```http
GET /api/services
```

**Query Parameters:**

- `locale` - Language (en, ar)

**Response (200):**

```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Property Management",
      "description": "...",
      "icon": "home",
      "sort_order": 1
    }
  ]
}
```

---

## Articles

### List Articles

```http
GET /api/articles
```

**Query Parameters:**

- `featured` - Show only featured (true/false)
- `per_page` - Items per page
- `page` - Page number

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "slug": "real-estate-tips",
      "title": "Real Estate Tips",
      "excerpt": "...",
      "image": "...",
      "published_at": "2025-01-15",
      "views": 150,
      "author": {...}
    }
  ]
}
```

### Get Article by Slug

```http
GET /api/articles/{slug}
```

**Response (200):**

```json
{
  "data": {
    "id": 1,
    "slug": "real-estate-tips",
    "title": "Real Estate Tips",
    "content": "...",
    "image": "...",
    "published_at": "2025-01-15",
    "views": 151,
    "author": {...}
  }
}
```

---

## Testimonials

### List Testimonials

```http
GET /api/testimonials
```

**Query Parameters:**

- `featured` - Show only featured (true/false)
- `locale` - Language (en, ar)

**Response (200):**

```json
{
  "success": true,
  "message": "Testimonials retrieved successfully",
  "data": [
    {
      "id": 1,
      "client_name": "Sarah Johnson",
      "country_flag": "🇺🇸",
      "comment": "Excellent service!",
      "rating": 5,
      "photo": "...",
      "is_featured": true
    }
  ]
}
```

---

## Neighborhoods

### List Neighborhoods

```http
GET /api/neighborhoods
```

**Query Parameters:**

- `city` - Filter by city

**Response (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Malki",
      "slug": "malki",
      "city": "Damascus",
      "description": "..."
    }
  ]
}
```

### Get Neighborhood by Slug

```http
GET /api/neighborhoods/{slug}
```

---

## AI Features

### AI Search

```http
POST /api/ai-search
```

**Request Body:**

```json
{
  "query": "I need a cheap flat in Malki with solar power",
  "per_page": 12
}
```

**Response (200):**

```json
{
  "data": [...],
  "extracted_filters": {
    "price_range": "low",
    "location": "Malki",
    "amenities": ["solar"]
  }
}
```

### AI Concierge Chat

```http
POST /api/ai-concierge/chat
```

**Request Body:**

```json
{
  "message": "Is this property available from March 1-5?",
  "conversation_history": [],
  "current_page": "/properties/luxury-apartment"
}
```

**Response (200):**

```json
{
  "response": "Yes, the property is available...",
  "tools_used": ["check_availability"]
}
```

---

## Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Forbidden"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Failed to process request. Please try again later."
}
```

### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

---

## Rate Limits

- **Authentication routes**: 10 requests/minute
- **AI routes**: 20 requests/minute
- **Booking routes**: 30 requests/minute
- **Public read routes**: 60 requests/minute
- **Contact/Lead routes**: 10 requests/minute
- **Payment routes**: 20 requests/minute

---

## Notes

- All dates are in `Y-m-d` format (e.g., `2025-02-15`)
- All prices are in the property's currency
- Images are returned as relative paths (prepend with API base URL)
- Translatable fields support `en` and `ar` locales
- Use `locale` query parameter to get translated content

---

**Last Updated**: Now
**Version**: 2.0
