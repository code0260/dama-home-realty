# Enterprise Upgrade Guide - Content Marketing & Analytics

## Overview

This guide covers the implementation of Blog/News System, Advanced Admin Dashboard with Charts, and Database Notifications.

## 📝 1. Blog / News System

### Backend

**Model:** `App\Models\Article`
- Translatable fields: `title`, `content`
- Fields: `slug`, `image`, `author_id`, `published_at`, `is_featured`, `views`
- Auto-generates slug from title

**Filament Resource:** `App\Filament\Resources\ArticleResource`
- Rich text editor for content (English & Arabic)
- Image upload with optimization (WebP)
- Publishing controls (published_at, is_featured)
- Author assignment

**API Endpoints:**
- `GET /api/articles` - List published articles (with pagination)
- `GET /api/articles/{slug}` - Get single article (increments views)

### Frontend

**Pages:**
- `/blog` - Blog listing page (Grid view)
- `/blog/[slug]` - Article detail page with share buttons

**Components:**
- `LatestNews` - Homepage section showing 3 latest articles

**Features:**
- SEO-friendly URLs
- Social sharing (Facebook, Twitter, LinkedIn)
- View counter
- Featured articles badge

---

## 📊 2. Advanced Admin Dashboard (Filament Widgets)

### Widgets Created

#### 1. RevenueChart (Line Chart)
- **Location:** Filament Dashboard
- **Data:** Revenue from bookings (last 12 months)
- **Source:** `Booking::where('payment_status', 'paid')->sum('amount_paid')`
- **Type:** Line chart

#### 2. BookingsChart (Bar Chart)
- **Location:** Filament Dashboard
- **Data:** Number of bookings per month (last 12 months)
- **Source:** `Booking::count()` grouped by month
- **Type:** Bar chart

#### 3. PopularNeighborhoods (Pie Chart)
- **Location:** Filament Dashboard
- **Data:** Top 5 neighborhoods by property count
- **Source:** `Neighborhood::withCount('properties')`
- **Type:** Pie chart

#### 4. LatestLeads (Table Widget)
- **Location:** Filament Dashboard
- **Data:** Last 5 leads/inquiries
- **Columns:** Name, Phone, Type, Property, Status, Created
- **Type:** Table widget

### Registration

Widgets are registered in `App\Providers\Filament\AdminPanelProvider`:
```php
->widgets([
    Widgets\AccountWidget::class,
    \App\Filament\Widgets\RevenueChart::class,
    \App\Filament\Widgets\BookingsChart::class,
    \App\Filament\Widgets\PopularNeighborhoods::class,
    \App\Filament\Widgets\LatestLeads::class,
])
```

---

## 🔔 3. Database Notifications

### Notifications Created

#### NewLeadNotification
- **Trigger:** When a new Lead is created (API or Filament)
- **Recipients:** All Super Admin users
- **Channels:** Database + Email
- **Content:** Lead name, phone, type, property title

#### NewBookingNotification
- **Trigger:** When a new Booking is created (API or Filament)
- **Recipients:** All Super Admin users
- **Channels:** Database + Email
- **Content:** User name, property title, dates, total price

### Implementation

**In Filament:**
- `CreateLead::afterCreate()` - Sends notification
- `CreateBooking::afterCreate()` - Sends notification

**In API Controllers:**
- `LeadController::store()` - Sends notification
- `BookingController::store()` - Sends notification

### Database Table

Migration: `2025_11_20_231336_create_notifications_table.php`
- Created via `php artisan notifications:table`
- Stores notifications in database
- Accessible via Filament notification bell

---

## 🚀 Setup Instructions

### 1. Run Migrations

```bash
cd backend
php artisan migrate
```

This will create:
- `articles` table
- `notifications` table (if not exists)

### 2. Create Articles in Filament

1. Go to `/admin/articles`
2. Click "New Article"
3. Fill in:
   - Title (English & Arabic)
   - Content (Rich text, English & Arabic)
   - Featured Image
   - Author
   - Published At (or leave empty for draft)
   - Featured toggle

### 3. View Dashboard Widgets

1. Go to `/admin` (Dashboard)
2. You should see:
   - Revenue Chart (Line)
   - Bookings Chart (Bar)
   - Popular Neighborhoods (Pie)
   - Latest Leads (Table)

### 4. Test Notifications

1. Create a Lead via API or Filament
2. Create a Booking via API or Filament
3. Check Filament notification bell (top right)
4. You should see notifications like:
   - "New live_tour_request from Ahmad"
   - "New booking from John for Luxury Apartment"

---

## 📁 Files Created/Updated

### Backend

**Models:**
- `app/Models/Article.php`

**Migrations:**
- `database/migrations/2025_11_20_230603_create_articles_table.php`
- `database/migrations/2025_11_20_231336_create_notifications_table.php`

**Controllers:**
- `app/Http/Controllers/Api/ArticleController.php`

**Resources:**
- `app/Http/Resources/ArticleResource.php`
- `app/Filament/Resources/ArticleResource.php`
- `app/Filament/Resources/ArticleResource/Pages/*.php`

**Widgets:**
- `app/Filament/Widgets/RevenueChart.php`
- `app/Filament/Widgets/BookingsChart.php`
- `app/Filament/Widgets/PopularNeighborhoods.php`
- `app/Filament/Widgets/LatestLeads.php`

**Notifications:**
- `app/Notifications/NewLeadNotification.php`
- `app/Notifications/NewBookingNotification.php`

**Updated:**
- `routes/api.php` - Added article routes
- `app/Http/Controllers/Api/LeadController.php` - Added notification
- `app/Http/Controllers/Api/BookingController.php` - Added notification
- `app/Filament/Resources/LeadResource/Pages/CreateLead.php` - Added notification
- `app/Filament/Resources/BookingResource/Pages/CreateBooking.php` - Added notification
- `app/Providers/Filament/AdminPanelProvider.php` - Registered widgets

### Frontend

**Pages:**
- `app/blog/page.tsx` - Blog listing
- `app/blog/[slug]/page.tsx` - Article detail

**Components:**
- `components/sections/LatestNews.tsx` - Homepage section

**Updated:**
- `app/page.tsx` - Added Latest News section
- `components/ui-custom/Navbar.tsx` - Added Blog link
- `lib/api.ts` - Added `getArticles()` and `getArticleBySlug()`
- `types/index.ts` - Added `Article` interface

---

## 🎯 Features Summary

### Blog System
✅ Multi-language support (English & Arabic)  
✅ Rich text editor  
✅ Image optimization (WebP)  
✅ SEO-friendly URLs  
✅ Social sharing  
✅ View counter  
✅ Featured articles  
✅ Draft/Publish workflow  

### Admin Dashboard
✅ Revenue visualization (Line chart)  
✅ Bookings trend (Bar chart)  
✅ Popular neighborhoods (Pie chart)  
✅ Latest leads table  
✅ Real-time data  

### Notifications
✅ Database notifications  
✅ Email notifications  
✅ Real-time alerts in Filament  
✅ Automatic notification on Lead creation  
✅ Automatic notification on Booking creation  

---

## 📝 Next Steps

1. **Run Migrations:**
   ```bash
   cd backend
   php artisan migrate
   ```

2. **Create Sample Articles:**
   - Go to Filament Admin → Articles
   - Create 3-5 articles with content
   - Set `published_at` to make them visible

3. **Test Notifications:**
   - Create a test Lead
   - Create a test Booking
   - Check Filament notification bell

4. **View Dashboard:**
   - Go to `/admin`
   - Verify all widgets are displaying correctly

---

**Version:** 2.1.0  
**Last Updated:** 2025-01-20

