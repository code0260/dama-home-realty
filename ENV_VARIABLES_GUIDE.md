# دليل متغيرات البيئة (.env) - Dama Home Realty

## 📋 جميع المتغيرات المطلوبة

### 🔴 متغيرات أساسية (Required - Critical)

```env
# Application
APP_NAME="Dama Home Realty"
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=UTC
APP_LOCALE=en
APP_FALLBACK_LOCALE=en

# Frontend URL (مهم للـ CORS و redirects)
FRONTEND_URL=http://localhost:3000
```

### 🟡 قاعدة البيانات (Database)

```env
# MySQL (Recommended for production)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dama_home_realty
DB_USERNAME=root
DB_PASSWORD=

# أو SQLite (للـ development)
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite
```

### 🟢 Stripe Payment (مطلوب للـ payments)

```env
STRIPE_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY
STRIPE_SECRET=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### 🔵 Booking Configuration (إعدادات الحجوزات)

```env
# Deposit percentage (نسبة العربون)
BOOKING_DEPOSIT_PERCENTAGE=30

# Minimum/Maximum nights
BOOKING_MIN_NIGHTS=1
BOOKING_MAX_NIGHTS=365

# Cancellation policy
BOOKING_CANCELLATION_DAYS=7
```

### 🟣 البريد الإلكتروني (Email)

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@dama-home.com"
MAIL_FROM_NAME="${APP_NAME}"

# أو استخدام Mailgun
# MAIL_MAILER=mailgun
# MAILGUN_DOMAIN=your-domain.com
# MAILGUN_SECRET=your-mailgun-secret
```

### 🟠 Cache & Session

```env
# Cache
CACHE_STORE=file
# أو CACHE_STORE=redis (للـ production)

# Session
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

### ⚪ Queue (للـ background jobs)

```env
QUEUE_CONNECTION=sync
# أو QUEUE_CONNECTION=database (للـ production)
```

### 🔴 Sanctum (للـ SPA Authentication)

```env
# Stateful domains (للـ Sanctum SPA auth)
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

---

## ✅ Checklist للتحقق من .env

### متغيرات أساسية (يجب أن تكون موجودة):

- [ ] `APP_NAME` - اسم التطبيق
- [ ] `APP_KEY` - يجب أن يكون موجود (شغّل `php artisan key:generate`)
- [ ] `APP_URL` - URL الـ backend
- [ ] `FRONTEND_URL` - URL الـ frontend (مهم!)
- [ ] `DB_CONNECTION` - نوع قاعدة البيانات
- [ ] `DB_DATABASE` - اسم قاعدة البيانات
- [ ] `DB_USERNAME` - اسم المستخدم
- [ ] `DB_PASSWORD` - كلمة المرور

### متغيرات Stripe (مطلوبة للـ payments):

- [ ] `STRIPE_KEY` - Stripe Public Key
- [ ] `STRIPE_SECRET` - Stripe Secret Key
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook Secret

### متغيرات Booking (اختيارية - لها defaults):

- [ ] `BOOKING_DEPOSIT_PERCENTAGE=30` (افتراضي: 30)
- [ ] `BOOKING_MIN_NIGHTS=1` (افتراضي: 1)
- [ ] `BOOKING_MAX_NIGHTS=365` (افتراضي: 365)
- [ ] `BOOKING_CANCELLATION_DAYS=7` (افتراضي: 7)

---

## 🔍 المشاكل الشائعة في .env

### 1. ❌ APP_KEY مفقود أو غير صحيح

**المشكلة:**

```
No application encryption key has been specified.
```

**الحل:**

```bash
php artisan key:generate
```

### 2. ❌ FRONTEND_URL غير موجود

**المشكلة:**

- CORS errors
- Payment redirects لا تعمل

**الحل:**

```env
FRONTEND_URL=http://localhost:3000
```

### 3. ❌ STRIPE keys مفقودة

**المشكلة:**

- Payments لا تعمل
- Checkout sessions تفشل

**الحل:**

- احصل على Stripe keys من Stripe Dashboard
- أضفها في .env

### 4. ❌ Database connection فاشل

**المشكلة:**

```
SQLSTATE[HY000] [2002] No connection could be made
```

**الحل:**

- تأكد من أن MySQL يعمل
- تحقق من DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
- تأكد من أن قاعدة البيانات موجودة

### 5. ❌ CORS errors

**المشكلة:**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**الحل:**

- تأكد من `FRONTEND_URL` موجود في .env
- تأكد من `APP_URL` صحيح
- تحقق من `config/cors.php`

---

## 📝 مثال كامل لملف .env

```env
# ============================================
# Application Settings
# ============================================
APP_NAME="Dama Home Realty"
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=UTC
APP_LOCALE=en
APP_FALLBACK_LOCALE=en

# ============================================
# Frontend URL (مهم!)
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# Database Configuration
# ============================================
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dama_home_realty
DB_USERNAME=root
DB_PASSWORD=

# ============================================
# Stripe Payment Configuration
# ============================================
STRIPE_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY
STRIPE_SECRET=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# ============================================
# Booking Configuration
# ============================================
BOOKING_DEPOSIT_PERCENTAGE=30
BOOKING_MIN_NIGHTS=1
BOOKING_MAX_NIGHTS=365
BOOKING_CANCELLATION_DAYS=7

# ============================================
# Mail Configuration
# ============================================
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@dama-home.com"
MAIL_FROM_NAME="${APP_NAME}"

# ============================================
# Cache & Session
# ============================================
CACHE_STORE=file
SESSION_DRIVER=file
SESSION_LIFETIME=120

# ============================================
# Queue
# ============================================
QUEUE_CONNECTION=sync

# ============================================
# Sanctum (SPA Authentication)
# ============================================
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

---

## 🚀 خطوات التحقق

### 1. تحقق من APP_KEY:

```bash
php artisan key:generate
```

### 2. تحقق من Database:

```bash
php artisan migrate:status
```

### 3. Clear Cache:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 4. اختبار الاتصال:

```bash
php artisan tinker
# ثم:
DB::connection()->getPdo();
```

---

## ⚠️ ملاحظات مهمة

1. **لا ترفع .env إلى Git!** ✅

   - ملف .env موجود في .gitignore
   - استخدم .env.example للتوثيق

2. **في Production:**

   - `APP_DEBUG=false`
   - `APP_ENV=production`
   - استخدم MySQL بدلاً من SQLite
   - استخدم Redis للـ cache
   - استخدم queue workers

3. **Security:**
   - لا تشارك .env مع أحد
   - استخدم strong passwords
   - استخدم environment-specific keys

---

## ✅ الخلاصة

**المتغيرات الحرجة:**

- ✅ APP_KEY (يجب أن يكون موجود)
- ✅ APP_URL
- ✅ FRONTEND_URL (مهم!)
- ✅ Database credentials
- ✅ Stripe keys (للـ payments)

**المتغيرات الاختيارية:**

- Booking configuration (لها defaults)
- Mail configuration
- Cache/Session configuration

---

**تاريخ الإنشاء:** $(date)
**آخر تحديث:** بعد تطبيق التحسينات
