# 📦 أوامر التثبيت - Future-Proofing Features

# Installation Commands - Future-Proofing Features

## 1. Backend: Excel Export/Import

```bash
cd backend
composer require pkeogan/filament-excel
```

## 2. Backend: Activity Logging

```bash
cd backend
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migration"
php artisan migrate
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-config"
```

## 3. Frontend: PWA Support

```bash
cd backend/frontend
npm install @ducanh2912/next-pwa
```

---

## ✅ بعد التثبيت

1. تشغيل Migrations للـ Activity Log
2. تحديث Filament Resources
3. تحديث Next.js Config
4. إضافة Manifest

---

**ملاحظة**: بعد تثبيت الحزم، سيتم إنشاء الكود تلقائياً.
