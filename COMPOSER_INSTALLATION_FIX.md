# 🔧 حل مشكلة Composer

## المشكلة

- `composer` غير معروف في PowerShell
- الحزم غير مثبتة: `spatie/laravel-activitylog` و `pkeogan/filament-excel`

## الحلول

### الحل 1: تثبيت Composer (موصى به)

#### Windows:

1. اذهب إلى: https://getcomposer.org/download/
2. حمّل `Composer-Setup.exe`
3. شغّل المثبت واتبع التعليمات
4. أعد فتح PowerShell

#### التحقق:

```powershell
composer --version
```

---

### الحل 2: استخدام Composer.phar محلياً

1. حمّل `composer.phar` من: https://getcomposer.org/download/
2. ضعه في مجلد `backend/`
3. استخدم:

```powershell
cd backend
php composer.phar install
```

---

### الحل 3: استخدام Laravel Sail (إذا كان Docker مثبت)

```powershell
cd backend
.\vendor\bin\sail composer require spatie/laravel-activitylog
.\vendor\bin\sail composer require pkeogan/filament-excel
```

---

## بعد تثبيت Composer

### 1. تثبيت الحزم

```powershell
cd backend
composer install
```

أو:

```powershell
cd backend
composer require spatie/laravel-activitylog
composer require pkeogan/filament-excel
```

### 2. نشر Activity Log

```powershell
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migration"
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-config"
```

### 3. تشغيل Migrations

```powershell
php artisan migrate:fresh --seed
```

---

## ملاحظة مهمة

إذا كانت الحزم موجودة في `composer.json` لكن غير مثبتة في `vendor/`:

- يجب تشغيل `composer install` أولاً
- ثم نشر Activity Log files
- ثم تشغيل migrations

---

**الحالة الحالية**: ⚠️ Composer غير متاح - يحتاج تثبيت
