# Version 2.0 Setup Guide - AI & Advanced Maps

This guide will help you set up the new AI Search and Google Maps features.

## 📦 Installation Steps

### 1. Backend Setup (Laravel)

#### Install OpenAI PHP Client

```bash
cd backend
composer require openai-php/laravel
```

#### Publish OpenAI Config (Optional)

```bash
php artisan vendor:publish --provider="OpenAI\Laravel\ServiceProvider"
```

#### Add OpenAI API Key to `.env`

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Update CORS Configuration

Make sure your `config/cors.php` allows requests from your frontend domain.

### 2. Frontend Setup (Next.js)

#### Install Google Maps React Library

```bash
cd backend/frontend
npm install @react-google-maps/api
```

#### Add Google Maps API Key

Create or update `.env.local` in `backend/frontend/`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Restrict the API key to your domain (recommended for production)
6. Copy the API key to `.env.local`

**Required APIs:**
- Maps JavaScript API
- Places API (optional, for autocomplete)

### 4. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to backend `.env`

**Note:** OpenAI API usage is pay-as-you-go. Monitor your usage in the dashboard.

## 🚀 Features Overview

### 1. AI Magic Search

- **Location:** Hero Section (Homepage)
- **How it works:**
  - Users type natural language queries (e.g., "cheap flat in Malki with solar power")
  - AI extracts structured filters (type, price, location, amenities)
  - Results appear dynamically in a dialog

- **Example Queries:**
  - "cheap apartment in Malki"
  - "villa with pool and garden"
  - "2 bedroom flat under 300 USD"
  - "apartment with solar power"

### 2. Interactive Map Search

- **URL:** `/map-search`
- **Features:**
  - Split screen: Property list (left) + Map (right)
  - Custom markers showing property price
  - Click marker to see property info
  - Info windows with property details
  - Search as you move the map (bounds-based filtering)

### 3. JSON-LD Structured Data

- **Location:** Property Details pages
- **Benefits:**
  - Rich snippets in Google Search
  - Shows price, rating, and property details directly in search results
  - Better SEO and click-through rates

## 🔧 Configuration

### Backend Configuration

**File:** `backend/config/services.php`

```php
'openai' => [
    'api_key' => env('OPENAI_API_KEY'),
],
```

### Frontend Configuration

**File:** `backend/frontend/.env.local`

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📝 API Endpoints

### AI Search

**POST** `/api/ai-search`

**Request Body:**
```json
{
  "query": "cheap flat in Malki with solar power",
  "per_page": 15
}
```

**Response:**
```json
{
  "query": "cheap flat in Malki with solar power",
  "extracted_filters": {
    "type": "apartment",
    "neighborhood": "Malki",
    "max_price": 500,
    "amenities": ["solar_power"]
  },
  "data": [...],
  "pagination": {...}
}
```

## 🐛 Troubleshooting

### AI Search Not Working

1. Check OpenAI API key in `.env`
2. Verify API key has credits/balance
3. Check Laravel logs: `storage/logs/laravel.log`
4. Ensure `openai-php/laravel` is installed

### Google Maps Not Loading

1. Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
2. Check browser console for errors
3. Ensure Maps JavaScript API is enabled in Google Cloud
4. Check API key restrictions (if any)

### Map Markers Not Showing

- Properties need neighborhood coordinates
- Currently using default coordinates for neighborhoods
- In production, add `latitude` and `longitude` to `neighborhoods` table

## 🎯 Next Steps

1. **Add Real Coordinates:**
   - Add `latitude` and `longitude` columns to `neighborhoods` table
   - Update Property model to include coordinates
   - Use real coordinates instead of defaults

2. **Enhance AI Search:**
   - Add more context about available neighborhoods
   - Improve amenity extraction
   - Add price range suggestions

3. **Map Features:**
   - Add clustering for many markers
   - Implement "Search as I move" functionality
   - Add drawing tools for area selection

## 📚 Documentation

- [OpenAI PHP Laravel](https://github.com/openai-php/laravel)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

---

**Version:** 2.0.0  
**Last Updated:** 2025-01-19

