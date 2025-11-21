# ✅ Checklist للتحقق من ملف .env

## 🔴 متغيرات حرجة (يجب أن تكون موجودة)

### Application Settings
- [ ] `APP_NAME="Dama Home Realty"`
- [ ] `APP_KEY=base64:...` (شغّل `php artisan key:generate` إذا مفقود)
- [ ] `APP_URL=http://localhost:8000`
- [ ] `FRONTEND_URL=http://localhost:3000` ⚠️ **مهم جداً!**

### Database
- [ ] `DB_CONNECTION=mysql` (أو sqlite للـ development)
- [ ] `DB_DATABASE=dama_home_realty`
- [ ] `DB_USERNAME=root`
- [ ] `DB_PASSWORD=` (أو كلمة المرور)

### Stripe (للـ payments)
- [ ] `STRIPE_KEY=pk_test_...`
- [ ] `STRIPE_SECRET=sk_test_...`
- [ ] `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 🟡 متغيرات مهمة (يُنصح بإضافتها)

### Booking Configuration
- [ ] `BOOKING_DEPOSIT_PERCENTAGE=30`
- [ ] `BOOKING_MIN_NIGHTS=1`
- [ ] `BOOKING_MAX_NIGHTS=365`
- [ ] `BOOKING_CANCELLATION_DAYS=7`

### Mail Configuration
- [ ] `MAIL_MAILER=smtp`
- [ ] `MAIL_FROM_ADDRESS="noreply@dama-home.com"`
- [ ] `MAIL_FROM_NAME="${APP_NAME}"`

---

## ✅ خطوات التحقق السريع

### 1. تحقق من APP_KEY:
```bash
cd backend
php artisan key:generate
```

### 2. تحقق من FRONTEND_URL:
```bash
# تأكد من وجود هذا السطر في .env:
FRONTEND_URL=http://localhost:3000
```

### 3. Clear Cache:
```bash
php artisan config:clear
php artisan cache:clear
```

### 4. اختبار الاتصال:
```bash
php artisan migrate:status
```

---

## ⚠️ المشاكل الشائعة

### ❌ المشكلة: `config('app.frontend_url')` لا يعمل
**السبب:** المتغير غير موجود في config/app.php

**الحل:** ✅ تم إصلاحه! تم إضافة `frontend_url` إلى config/app.php

### ❌ المشكلة: CORS errors
**السبب:** FRONTEND_URL غير موجود أو خاطئ

**الحل:**
```env
FRONTEND_URL=http://localhost:3000
```

### ❌ المشكلة: Payment redirects لا تعمل
**السبب:** FRONTEND_URL غير موجود

**الحل:**
```env
FRONTEND_URL=http://localhost:3000
```

---

## 📝 مثال كامل لملف .env

```env
APP_NAME="Dama Home Realty"
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

# ⚠️ مهم جداً!
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dama_home_realty
DB_USERNAME=root
DB_PASSWORD=

STRIPE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET=sk_test_YOUR_SECRET
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

BOOKING_DEPOSIT_PERCENTAGE=30
BOOKING_MIN_NIGHTS=1
BOOKING_MAX_NIGHTS=365
BOOKING_CANCELLATION_DAYS=7

MAIL_MAILER=smtp
MAIL_FROM_ADDRESS="noreply@dama-home.com"
MAIL_FROM_NAME="${APP_NAME}"
```

---

## ✅ الخلاصة

**المتغيرات الحرجة:**
1. ✅ `APP_KEY` - يجب أن يكون موجود
2. ✅ `FRONTEND_URL` - **مهم جداً!** (تم إصلاح config)
3. ✅ `APP_URL` - URL الـ backend
4. ✅ Database credentials
5. ✅ Stripe keys (للـ payments)

**تم إصلاح:**
- ✅ إضافة `frontend_url` إلى `config/app.php`
- ✅ الآن `config('app.frontend_url')` سيعمل بشكل صحيح

---

**تاريخ:** $(date)

