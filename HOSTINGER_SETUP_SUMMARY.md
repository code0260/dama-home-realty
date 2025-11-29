# ملخص إعدادات Hostinger - ما تم عمله

## ✅ ما تم إنجازه

### 1. إعداد Laravel Backend
- ✅ تثبيت Composer dependencies
- ✅ إنشاء ملف `.env` مع إعدادات قاعدة البيانات
- ✅ تشغيل Migrations
- ✅ إعداد Storage symlink
- ✅ Laravel API يعمل على: `https://damahomerealty.com/api`
- ✅ Admin Panel يعمل على: `https://damahomerealty.com/admin`

### 2. إعداد Next.js Frontend
- ✅ بناء Next.js مع `output: 'standalone'`
- ✅ نسخ ملفات `.next/static` إلى المكان الصحيح
- ✅ نسخ ملفات `public` إلى standalone build
- ✅ تشغيل Next.js عبر PM2 على `localhost:3000`
- ✅ Frontend يعمل على: `https://damahomerealty.com/`

### 3. إعداد Routing
- ✅ إنشاء `index.php` في `public_html/` كـ PHP Router
- ✅ إعداد `.htaccess` لتوجيه الطلبات إلى `index.php`
- ✅ Routing يعمل:
  - `/api/*` → Laravel
  - `/admin/*` → Laravel
  - `/storage/*` → Laravel Storage
  - كل شيء آخر → Next.js

### 4. إعداد PM2 Keep-Alive
- ✅ إنشاء script `keep_pm2_alive.sh`
- ✅ إضافة Cron Job (كل 5 دقائق)
- ✅ PM2 يعمل تلقائياً ولا يتوقف

### 5. إصلاح المشاكل
- ✅ إصلاح مشكلة `useSearchParams` في Next.js
- ✅ إصلاح مشكلة الصور (public folder)
- ✅ إصلاح مشكلة Static Files
- ✅ إصلاح مشكلة Laravel Storage

---

## 📁 الملفات المهمة على السيرفر

### ملفات يجب أن تبقى (لا تحذفها):
1. `public_html/index.php` - PHP Router
2. `public_html/.htaccess` - Apache Configuration
3. `public_html/frontend/.next/standalone/` - Next.js Build
4. `public_html/backend/.env` - Laravel Environment
5. `~/keep_pm2_alive.sh` - PM2 Keep-Alive Script

### ملفات تم رفعها على Git:
- ✅ `HOSTINGER_DEPLOYMENT.md` - توثيق شامل
- ✅ `keep_pm2_alive.sh` - PM2 Keep-Alive Script
- ✅ `backend/frontend/next.config.js` - Next.js Config
- ✅ `backend/frontend/app/list-property/page.tsx` - Fixed Page

### ملفات لم يتم رفعها على Git (خاصة بالسيرفر):
- ❌ `index.php` (في public_html/)
- ❌ `frontend-build.zip`
- ❌ `.env` files
- ❌ `.next/` build folders

---

## 🔄 عند التحديث في المستقبل

### إذا أردت تحديث الكود:

1. **على جهازك المحلي**:
   ```bash
   git pull
   # عدل الكود
   git add .
   git commit -m "Update description"
   git push
   ```

2. **على السيرفر (SSH)**:
   ```bash
   cd ~/domains/damahomerealty.com/public_html
   git pull
   
   # تحديث Laravel
   cd backend
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   php artisan config:cache
   
   # تحديث Next.js (يجب بناءه محلياً أولاً)
   # ثم رفع frontend-build.zip
   ```

### إذا أردت تحديث Next.js Frontend:

1. **على جهازك المحلي**:
   ```bash
   cd backend/frontend
   npm install
   npm run build
   zip -r frontend-build.zip .next/standalone/backend/frontend/.next/static .next/standalone/backend/frontend/public
   ```

2. **رفع `frontend-build.zip` إلى السيرفر**:
   - عبر File Manager أو SCP
   - إلى `public_html/frontend/`

3. **على السيرفر**:
   ```bash
   cd ~/domains/damahomerealty.com/public_html/frontend
   unzip -o frontend-build.zip
   cp -r .next/static .next/standalone/backend/frontend/.next/
   cp -r public .next/standalone/backend/frontend/
   pm2 restart nextjs
   ```

---

## ⚠️ تحذيرات مهمة

### ❌ لا تفعل:
1. **لا تحذف** `index.php` من `public_html/`
2. **لا تحذف** `.htaccess` من `public_html/`
3. **لا تحذف** `frontend/.next/standalone/`
4. **لا ترفع** `.env` على Git
5. **لا ترفع** `index.php` (من public_html) على Git

### ✅ يجب أن تفعل:
1. **احتفظ** بنسخة احتياطية من `index.php` و `.htaccess`
2. **تحقق** من PM2: `pm2 list`
3. **راقب** الـ logs: `pm2 logs nextjs`
4. **تحقق** من cron: `crontab -l`

---

## 🔍 أوامر مفيدة

### التحقق من الحالة:
```bash
# PM2 Status
pm2 list

# Next.js Logs
pm2 logs nextjs

# Laravel Logs
tail -50 ~/domains/damahomerealty.com/public_html/backend/storage/logs/laravel.log

# PM2 Keep-Alive Logs
tail -f ~/pm2_keepalive.log

# Cron Jobs
crontab -l
```

### إعادة التشغيل:
```bash
# إعادة تشغيل Next.js
pm2 restart nextjs

# إعادة تشغيل PM2 Keep-Alive
bash ~/keep_pm2_alive.sh
```

---

## 📊 الحالة الحالية

- ✅ **Laravel API**: يعمل
- ✅ **Next.js Frontend**: يعمل
- ✅ **الصور**: تعمل
- ✅ **PM2 Keep-Alive**: يعمل (كل 5 دقائق)
- ✅ **Git**: محدث

---

## 📝 ملاحظات إضافية

1. **PM2 Keep-Alive**: يعمل تلقائياً عبر cron job كل 5 دقائق
2. **Next.js Build**: موجود في `frontend/.next/standalone/backend/frontend/`
3. **Laravel Storage**: في `backend/storage/app/public/`
4. **Public Files**: في `frontend/.next/standalone/backend/frontend/public/`

---

**تاريخ آخر تحديث**: 29 نوفمبر 2025
**الحالة**: ✅ كل شيء يعمل بشكل كامل

