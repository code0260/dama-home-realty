# تثبيت الحزم المطلوبة

## الحزم المطلوبة

تم إضافة الحزم التالية إلى `composer.json`:

1. ✅ `spatie/laravel-activitylog` - لتسجيل نشاطات Models
2. ✅ `pkeogan/filament-excel` - لتصدير/استيراد Excel في Filament

## خطوات التثبيت

### 1. تثبيت الحزم

```bash
cd backend
composer install
```

أو إذا كانت الحزم غير موجودة في vendor:

```bash
cd backend
composer require spatie/laravel-activitylog
composer require pkeogan/filament-excel
```

### 2. نشر Activity Log Migration و Config

```bash
cd backend
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migration"
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-config"
```

### 3. تشغيل Migrations

```bash
cd backend
php artisan migrate:fresh --seed
```

## التحقق

بعد التثبيت، يجب أن:

- ✅ جميع migrations تعمل بدون أخطاء
- ✅ Activity Log table موجود
- ✅ Models (Property, Booking, Lead) تستخدم LogsActivity بدون أخطاء
- ✅ Filament Excel Export/Import يعمل

---

**ملاحظة**: إذا كان composer غير متاح في PATH، استخدم المسار الكامل أو استخدم terminal آخر.
