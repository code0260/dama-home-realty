# 🚀 دليل النشر على Hostinger - خطوة بخطوة

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من:

-   ✅ لديك حساب Hostinger مع SSH Access
-   ✅ لديك دومين (Domain) جاهز
-   ✅ لديك معلومات قاعدة البيانات من hPanel

---

## 🔥 الخطوات السريعة (Quick Deploy)

### 1️⃣ إعداد قاعدة البيانات من hPanel

1. اذهب إلى **hPanel** → **Databases** → **MySQL Databases**
2. أنشئ قاعدة بيانات جديدة:
    - **Database Name**: `dama_home_realty`
    - **Username**: `dama_user`
    - **Password**: كلمة مرور قوية (احفظها!)
3. تأكد من ربط المستخدم بقاعدة البيانات

---

### 2️⃣ الاتصال عبر SSH

```bash
# من جهازك المحلي
ssh username@yourdomain.com
# أو
ssh username@your-server-ip
```

**ملاحظة:** احصل على معلومات SSH من:

-   **hPanel** → **Advanced** → **SSH Access**

---

### 3️⃣ الانتقال إلى مجلد المشروع

```bash
# عادة في Hostinger يكون المسار:
cd ~/domains/yourdomain.com/public_html

# أو
cd ~/public_html
```

---

### 4️⃣ استنساخ المشروع من Git

```bash
# إذا كان المجلد فارغاً
git clone https://github.com/code0260/dama-home-realty.git .

# أو إذا كان المجلد موجوداً
git clone https://github.com/code0260/dama-home-realty.git temp
cp -r temp/* .
cp -r temp/.* . 2>/dev/null || true
rm -rf temp
```

---

### 5️⃣ إعداد Laravel Backend

```bash
# الانتقال إلى مجلد Backend
cd backend

# تثبيت Composer Dependencies
composer install --no-dev --optimize-autoloader

# إذا لم يكن Composer مثبتاً:
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php composer.phar install --no-dev --optimize-autoloader

# إنشاء ملف .env
cp .env.example .env
nano .env
```

---

### 6️⃣ تعديل ملف .env

افتح `.env` وعدّل الإعدادات التالية:

```env
APP_NAME="Dama Home Realty"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database - استخدم المعلومات من hPanel
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dama_home_realty
DB_USERNAME=dama_user
DB_PASSWORD=your_database_password

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Mail (اختياري - يمكن إعداده لاحقاً)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yourdomain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

**احفظ الملف:** `Ctrl+X` ثم `Y` ثم `Enter`

---

### 7️⃣ إكمال إعداد Laravel

```bash
# توليد APP_KEY
php artisan key:generate

# إعداد الصلاحيات
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# تشغيل Migrations
php artisan migrate --force

# إنشاء Storage Link
php artisan storage:link

# تحسين الأداء
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

### 8️⃣ إعداد Next.js Frontend

```bash
# الانتقال إلى مجلد Frontend
cd ../frontend
# أو
cd backend/frontend

# التحقق من Node.js
node -v  # يجب أن يكون 18.x أو أحدث

# تثبيت Dependencies
npm install --production

# إنشاء ملف .env.local
nano .env.local
```

أضف في `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NODE_ENV=production
```

**احفظ الملف:** `Ctrl+X` ثم `Y` ثم `Enter`

```bash
# بناء المشروع
npm run build
```

---

### 9️⃣ تثبيت وتشغيل PM2

```bash
# تثبيت PM2
npm install -g pm2

# الانتقال إلى مجلد Frontend
cd backend/frontend

# تشغيل التطبيق
pm2 start npm --name "dama-frontend" -- start

# حفظ الإعدادات
pm2 save

# تفعيل PM2 عند إعادة تشغيل السيرفر
pm2 startup
# اتبع التعليمات التي تظهر
```

---

### 🔟 إعداد Nginx (إذا كان لديك صلاحيات root)

```bash
# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/yourdomain.com
```

انسخ التكوين التالي (استبدل `yourdomain.com` بدومينك):

```nginx
# إعادة التوجيه من HTTP إلى HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Frontend (Next.js)
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (سيتم إضافتها من hPanel)
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    # Logs
    access_log /var/log/nginx/yourdomain.com.access.log;
    error_log /var/log/nginx/yourdomain.com.error.log;

    # Max upload size
    client_max_body_size 50M;

    # Next.js App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API (Laravel) - إذا كنت تريد api.yourdomain.com
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    root /home/username/domains/yourdomain.com/public_html/backend/public;
    index index.php index.html;

    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

```bash
# تفعيل التكوين
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

# التحقق من صحة التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

**ملاحظة:** إذا لم يكن لديك صلاحيات root، استخدم `.htaccess` (انظر الخطوة 11)

---

### 1️⃣1️⃣ إعداد SSL Certificate

**من hPanel:**

1. اذهب إلى **hPanel** → **SSL**
2. اختر **Let's Encrypt**
3. اختر دومينك
4. اضغط **Install**

**أو من Terminal:**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### 1️⃣2️⃣ إعداد Cron Jobs

```bash
# فتح Crontab
crontab -e

# أضف السطر التالي (استبدل المسار):
* * * * * cd /home/username/domains/yourdomain.com/public_html/backend && php artisan schedule:run >> /dev/null 2>&1
```

**احفظ:** `Ctrl+X` ثم `Y` ثم `Enter`

---

### 1️⃣3️⃣ التحقق من النشر

```bash
# التحقق من PM2
pm2 status
pm2 logs dama-frontend

# التحقق من Laravel
cd backend
php artisan route:list
php artisan config:show

# التحقق من قاعدة البيانات
php artisan tinker
# ثم اكتب: DB::connection()->getPdo();
```

**افتح المتصفح:**

-   ✅ `https://yourdomain.com` - يجب أن يعمل Frontend
-   ✅ `https://yourdomain.com/api` - يجب أن يعمل API

---

## 🔄 التحديثات المستقبلية

### تحديث Backend:

```bash
cd ~/domains/yourdomain.com/public_html/backend
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
```

### تحديث Frontend:

```bash
cd ~/domains/yourdomain.com/public_html/backend/frontend
git pull origin main
npm install --production
npm run build
pm2 restart dama-frontend
```

---

## 🛠️ الأوامر المفيدة

```bash
# PM2
pm2 status                    # عرض الحالة
pm2 logs dama-frontend        # عرض السجلات
pm2 restart dama-frontend     # إعادة التشغيل
pm2 stop dama-frontend        # إيقاف
pm2 monit                     # مراقبة

# Laravel
php artisan cache:clear       # مسح الكاش
php artisan config:clear       # مسح تكوين الكاش
php artisan optimize          # تحسين الأداء
tail -f storage/logs/laravel.log  # عرض السجلات

# Nginx
sudo nginx -t                 # اختبار التكوين
sudo systemctl reload nginx    # إعادة التحميل
```

---

## ⚠️ حل المشاكل الشائعة

### مشكلة 1: خطأ 500 في Laravel

```bash
chmod -R 775 storage bootstrap/cache
php artisan cache:clear
php artisan config:clear
```

### مشكلة 2: خطأ 502 Bad Gateway

```bash
pm2 status
pm2 restart dama-frontend
```

### مشكلة 3: مشكلة في قاعدة البيانات

```bash
# تحقق من إعدادات .env
nano backend/.env
# تأكد من DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
```

---

## ✅ Checklist النشر

-   [ ] قاعدة بيانات جاهزة من hPanel
-   [ ] المشروع مستنسخ من Git
-   [ ] Backend مثبت ومكوّن (.env)
-   [ ] Migrations تم تشغيلها
-   [ ] Frontend مبني ويعمل
-   [ ] PM2 يعمل
-   [ ] Nginx مكوّن (أو .htaccess)
-   [ ] SSL مثبت
-   [ ] Cron Jobs مفعلة
-   [ ] الموقع يعمل على https://yourdomain.com

---

## 📞 الدعم

إذا واجهت مشاكل:

1. راجع السجلات:
    - Laravel: `tail -f backend/storage/logs/laravel.log`
    - Next.js: `pm2 logs dama-frontend`
2. تواصل مع دعم Hostinger
3. راجع `HOSTINGER_COMPLETE_DEPLOYMENT_GUIDE.md` للتفاصيل الكاملة

---

**🎉 تم النشر بنجاح!**
