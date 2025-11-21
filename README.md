# Dama Home Realty - Complete Real Estate Platform

A comprehensive real estate platform built with Laravel (Backend) and Next.js 14 (Frontend), designed to connect Syrian expats with trusted properties in Damascus.

## 🏗️ Tech Stack

### Backend

- **Laravel 11** - PHP Framework
- **Filament Admin Panel** - Admin interface
- **Laravel Sanctum** - SPA Authentication
- **Spatie Laravel Translatable** - Multi-language support
- **Spatie Laravel Permission** - Role-based access control
- **Laravel Cashier (Stripe)** - Payment processing
- **MySQL** - Database

### Frontend

- **Next.js 14** (App Router) - React Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI Components
- **Lucide React** - Icons
- **Axios** - HTTP Client
- **Date-fns** - Date manipulation

## ✨ Features

### Public Features (No Login Required)

- 🏠 **Property Listings** - Browse properties with advanced filters
- 🔍 **Property Search** - Search by type, neighborhood, price, features
- 📱 **Property Details** - Detailed property pages with image galleries
- 👥 **Agent Cards** - Contact agents directly via WhatsApp
- 🎥 **Live Tour Scheduling** - Request live video tours
- 🛠️ **Services Page** - Property management, legal assistance, airport pickup
- ⭐ **Testimonials** - Social proof from satisfied clients
- 📄 **Legal Pages** - Privacy Policy, Terms, Refund Policy

### Tenant Portal (VIP Dashboard)

- 📅 **Active Stay Dashboard** - Premium concierge-style interface
- ⏱️ **Stay Timeline** - Visual progress bar showing stay duration
- 🔑 **Private Access Info** - WiFi passwords, door codes, full addresses
- 📋 **House Rules** - Property-specific guidelines
- 🛎️ **My Services** - Track requested services
- 📊 **Booking Management** - View current, upcoming, and past bookings

### Admin Features (Filament)

- 🏘️ **Property Management** - Full CRUD with multi-language support
- 👤 **Agent Management** - Manage real estate agents
- 📝 **Lead Management** - Track inquiries, tour requests, service requests
- 📅 **Booking Calendar** - Visual booking timeline
- 💰 **Payment Processing** - Stripe integration
- 🎯 **Service Management** - Manage platform services
- ⭐ **Testimonial Management** - Manage client testimonials

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=dama_home_realty
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start server
php artisan serve
```

### Frontend Setup

```bash
cd backend/frontend

# Install dependencies
npm install

# Configure environment
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

### Admin Access

1. Create admin user:

```bash
php artisan tinker
User::create(['name' => 'Admin', 'email' => 'admin@dama-home.com', 'password' => bcrypt('password')]);
```

2. Access Filament Admin: `http://localhost:8000/admin`

## 📁 Project Structure

```
dama-home-realty/
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Filament/       # Admin Panel Resources
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API Controllers
│   │   │   └── Resources/         # API Resources
│   │   ├── Mail/           # Email Templates
│   │   └── Models/         # Eloquent Models
│   ├── database/
│   │   ├── migrations/     # Database Migrations
│   │   └── seeders/       # Database Seeders
│   └── routes/
│       └── api.php        # API Routes
│
└── backend/frontend/       # Next.js Frontend
    ├── app/               # App Router Pages
    ├── components/        # React Components
    ├── lib/              # Utilities & API Client
    └── types/            # TypeScript Types
```

## 🔐 Authentication

- **Public Routes**: All property pages, services, about, contact
- **Protected Routes**: `/portal`, `/bookings/*/payment`
- **Authentication**: Laravel Sanctum (Cookie-based SPA auth)

## 📧 Email Notifications

- Booking confirmation emails sent automatically
- HTML email templates with booking details
- Links to tenant portal

## 🎨 Design System

- **Primary Color**: Deep Navy Blue (#0F172A)
- **Secondary Color**: Bronze/Gold (#B49162)
- **Fonts**: Inter (English), Cairo (Arabic)

## 📝 License

This project is proprietary software.

## 👥 Contact

For support, email: info@dama-home.com

---

Built with ❤️ for Syrian expats seeking their home in Damascus.
