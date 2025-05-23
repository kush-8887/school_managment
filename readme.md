# School Management API

A simple Node.js + Express backend for managing schools and finding nearby schools by location.

## Live API

Base URL: https://school-managment-0uxo.onrender.com/api/

## Endpoints

### 1. Add a School

**Endpoint:** `POST /api/addSchool`

**Request Body:**
```json
{
    "name": "School for testing",
    "address": "School Address",
    "latitude": 28.6139,
    "longitude": 77.2090
}
```

**Responses:**
- `201 Created`
```json
{
    "message": "School added."
}
```
- `400 Bad Request`
```json
{
    "error": "All fields are required."
}
```

### 2. List Schools by Proximity

**Endpoint:** `GET /api/listSchools`

**Query Parameters:**
- `latitude` (required) - School's latitude coordinate
- `longitude` (required) - School's longitude coordinate

**Response:**
```json
[
    {
        "id": 1,
        "name": "School Name",
        "address": "School Address",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "distance": 0.0
    }
]
```

**Notes:**
- Results are sorted by nearest first
- Distance is measured in kilometers
