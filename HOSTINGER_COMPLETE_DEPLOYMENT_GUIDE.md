# 🚀 دليل النشر الكامل على Hostinger

## 📋 نظرة عامة

هذا الدليل يغطي نشر:

-   **Laravel Backend** (API)
-   **Next.js Frontend** (الموقع الأساسي)
-   **MySQL Database**
-   **SSL Certificate**

---

## 🔧 المتطلبات الأساسية

### 1. معلومات الوصول

-   ✅ دومين (Domain)
-   ✅ SSH Access
-   ✅ MySQL Database (من hPanel)
-   ✅ PHP 8.2+ (عادة متوفر في Hostinger)

### 2. متطلبات الخادم

-   **PHP**: 8.2 أو أحدث
-   **Composer**: لإدارة حزم PHP
-   **Node.js**: 18.x أو أحدث
-   **npm**: لإدارة حزم Node.js
-   **MySQL**: قاعدة البيانات
-   **Nginx/Apache**: خادم الويب

---

## 📝 الخطوة 1: إعداد قاعدة البيانات

### أ. إنشاء قاعدة البيانات من hPanel

1. اذهب إلى **hPanel** > **Databases** > **MySQL Databases**
2. أنشئ قاعدة بيانات جديدة:
    - **Database Name**: `dama_home_realty` (أو أي اسم تريده)
    - **Username**: `dama_user` (أو أي اسم تريده)
    - **Password**: كلمة مرور قوية
3. احفظ هذه المعلومات (ستحتاجها لاحقاً)

### ب. إضافة User إلى Database

-   تأكد من ربط المستخدم بقاعدة البيانات

---

## 📝 الخطوة 2: الاتصال عبر SSH

### أ. الحصول على معلومات SSH

1. اذهب إلى **hPanel** > **Advanced** > **SSH Access**
2. سجل معلومات الاتصال:
    - **Host**: `yourdomain.com` أو IP
    - **Port**: `22` (عادة)
    - **Username**: اسم المستخدم الخاص بك
    - **Password**: كلمة المرور

### ب. الاتصال عبر SSH

```bash
ssh username@yourdomain.com
# أو
ssh username@your-server-ip
```

---

## 📝 الخطوة 3: إعداد البنية الأساسية

### أ. الانتقال إلى مجلد المشروع

```bash
# عادة في Hostinger يكون المسار:
cd ~/domains/yourdomain.com/public_html

# أو
cd ~/public_html
```

### ب. استنساخ المشروع من GitHub

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

## 📝 الخطوة 4: إعداد Laravel Backend

### أ. الانتقال إلى مجلد Backend

```bash
cd backend
```

### ب. تثبيت Composer Dependencies

```bash
# تحميل Composer إذا لم يكن مثبتاً
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# تثبيت الحزم
php composer.phar install --no-dev --optimize-autoloader
# أو إذا كان Composer مثبتاً عالمياً:
composer install --no-dev --optimize-autoloader
```

### ج. إنشاء ملف .env

```bash
cp .env.example .env
nano .env
```

### د. تعديل ملف .env

```env
APP_NAME="Dama Home Realty"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://yourdomain.com
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

# Frontend URL
FRONTEND_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dama_home_realty
DB_USERNAME=dama_user
DB_PASSWORD=your_database_password

# Broadcast & Queue
BROADCAST_CONNECTION=pusher
QUEUE_CONNECTION=database

# Cache
CACHE_STORE=file
CACHE_PREFIX=

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

# Filesystem
FILESYSTEM_DISK=local

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your-email@yourdomain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Pusher (للإشعارات الفورية)
PUSHER_APP_ID=your-pusher-app-id
PUSHER_APP_KEY=your-pusher-key
PUSHER_APP_SECRET=your-pusher-secret
PUSHER_HOST=your-pusher-host
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

# OpenAI (لـ AI Concierge)
OPENAI_API_KEY=your-openai-api-key

# Stripe (للدفع)
STRIPE_KEY=your-stripe-key
STRIPE_SECRET=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

### هـ. توليد APP_KEY

```bash
php artisan key:generate
```

### و. إعداد الصلاحيات

```bash
# إعطاء صلاحيات الكتابة للمجلدات المطلوبة
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### ز. تشغيل Migrations

```bash
php artisan migrate --force
```

### ح. تشغيل Seeders (اختياري)

```bash
php artisan db:seed --force
```

### ط. إنشاء Storage Link

```bash
php artisan storage:link
```

### ي. تحسين الأداء

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

## 📝 الخطوة 5: إعداد Next.js Frontend

### أ. الانتقال إلى مجلد Frontend

```bash
cd frontend
```

### ب. تثبيت Node.js (إذا لم يكن مثبتاً)

```bash
# التحقق من إصدار Node.js
node -v

# إذا لم يكن مثبتاً، استخدم nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### ج. تثبيت npm Dependencies

```bash
npm install --production
```

### د. إنشاء ملف .env.local

```bash
nano .env.local
```

### هـ. إضافة المتغيرات

```env
# API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Environment
NODE_ENV=production

# Pusher (للإشعارات)
NEXT_PUBLIC_PUSHER_APP_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_HOST=your-pusher-host
NEXT_PUBLIC_PUSHER_PORT=443
NEXT_PUBLIC_PUSHER_SCHEME=https
NEXT_PUBLIC_PUSHER_APP_CLUSTER=mt1

# VAPID (للإشعارات - اختياري)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
```

### و. بناء المشروع

```bash
npm run build
```

---

## 📝 الخطوة 6: إعداد Nginx

### أ. إنشاء ملف تكوين Nginx

```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
```

### ب. إضافة التكوين التالي

```nginx
# إعادة التوجيه من HTTP إلى HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Backend API (Laravel)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /home/username/domains/yourdomain.com/public_html/backend/public;
    index index.php index.html;

    # Logs
    access_log /var/log/nginx/api.yourdomain.com.access.log;
    error_log /var/log/nginx/api.yourdomain.com.error.log;

    # Max upload size
    client_max_body_size 50M;

    # Laravel
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}

# Frontend (Next.js)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/yourdomain.com.access.log;
    error_log /var/log/nginx/yourdomain.com.error.log;

    # Max upload size
    client_max_body_size 50M;

    # Static files from Next.js
    location /_next/static {
        alias /home/username/domains/yourdomain.com/public_html/backend/frontend/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public files
    location /images {
        alias /home/username/domains/yourdomain.com/public_html/backend/frontend/public/images;
        add_header Cache-Control "public, max-age=31536000";
    }

    # API Proxy (إذا كنت تريد استخدام نفس الدومين)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

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

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### ج. تفعيل التكوين

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

# التحقق من صحة التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

---

## 📝 الخطوة 7: إعداد PM2 لتشغيل Next.js

### أ. تثبيت PM2

```bash
npm install -g pm2
```

### ب. إنشاء ملف ecosystem.config.js

```bash
cd ~/domains/yourdomain.com/public_html/backend/frontend
nano ecosystem.config.js
```

### ج. إضافة المحتوى

```javascript
module.exports = {
    apps: [
        {
            name: "dama-home-frontend",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            cwd: "/home/username/domains/yourdomain.com/public_html/backend/frontend",
            instances: 2,
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
            error_file: "./logs/err.log",
            out_file: "./logs/out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
        },
    ],
};
```

### د. إنشاء مجلد السجلات

```bash
mkdir -p logs
```

### هـ. تشغيل التطبيق

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📝 الخطوة 8: إعداد SSL Certificate

### أ. من hPanel

1. اذهب إلى **hPanel** > **SSL**
2. اختر **Let's Encrypt**
3. اختر دومينك
4. اضغط **Install**

### ب. أو باستخدام Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 📝 الخطوة 9: إعداد Cron Jobs

### أ. فتح Crontab

```bash
crontab -e
```

### ب. إضافة المهام التالية

```cron
# Laravel Scheduler
* * * * * cd /home/username/domains/yourdomain.com/public_html/backend && php artisan schedule:run >> /dev/null 2>&1

# Laravel Queue Worker (اختياري)
* * * * * cd /home/username/domains/yourdomain.com/public_html/backend && php artisan queue:work --sleep=3 --tries=3 >> /dev/null 2>&1
```

---

## 📝 الخطوة 10: إعداد Queue Worker (اختياري)

### أ. تشغيل Queue Worker باستخدام Supervisor

```bash
sudo apt-get install supervisor
sudo nano /etc/supervisor/conf.d/laravel-worker.conf
```

### ب. إضافة التكوين

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /home/username/domains/yourdomain.com/public_html/backend/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/home/username/domains/yourdomain.com/public_html/backend/storage/logs/worker.log
stopwaitsecs=3600
```

### ج. تشغيل Supervisor

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

---

## 📝 الخطوة 11: التحقق من التطبيق

### أ. التحقق من Laravel

```bash
# التحقق من الصلاحيات
ls -la storage bootstrap/cache

# التحقق من التكوين
php artisan config:show

# اختبار الاتصال بقاعدة البيانات
php artisan tinker
# ثم في Tinker:
# DB::connection()->getPdo();
```

### ب. التحقق من Next.js

```bash
# التحقق من PM2
pm2 status
pm2 logs dama-home-frontend

# التحقق من المنفذ
netstat -tulpn | grep 3000
```

### ج. التحقق من Nginx

```bash
sudo systemctl status nginx
sudo nginx -t
```

### د. فتح الموقع

-   افتح `https://yourdomain.com` في المتصفح
-   افتح `https://yourdomain.com/api` للتحقق من API

---

## 🔄 التحديثات المستقبلية

### تحديث Backend

```bash
cd ~/domains/yourdomain.com/public_html/backend
git pull origin main
php composer.phar install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### تحديث Frontend

```bash
cd ~/domains/yourdomain.com/public_html/backend/frontend
git pull origin main
npm install --production
npm run build
pm2 restart dama-home-frontend
```

---

## 🛠️ الأوامر المفيدة

### PM2

```bash
pm2 status                    # عرض الحالة
pm2 logs dama-home-frontend  # عرض السجلات
pm2 restart dama-home-frontend  # إعادة التشغيل
pm2 stop dama-home-frontend     # إيقاف
pm2 delete dama-home-frontend   # حذف
pm2 monit                      # مراقبة
```

### Laravel

```bash
php artisan cache:clear       # مسح الكاش
php artisan config:clear       # مسح تكوين الكاش
php artisan route:clear        # مسح راوت الكاش
php artisan view:clear         # مسح فيو الكاش
php artisan optimize           # تحسين الأداء
```

### Nginx

```bash
sudo nginx -t                  # اختبار التكوين
sudo systemctl reload nginx     # إعادة التحميل
sudo systemctl restart nginx    # إعادة التشغيل
sudo tail -f /var/log/nginx/error.log  # عرض الأخطاء
```

---

## 🔍 حل المشاكل الشائعة

### مشكلة 1: خطأ 500 في Laravel

```bash
# التحقق من الصلاحيات
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# التحقق من السجلات
tail -f storage/logs/laravel.log

# مسح الكاش
php artisan cache:clear
php artisan config:clear
```

### مشكلة 2: خطأ 502 Bad Gateway

```bash
# التحقق من PM2
pm2 status

# التحقق من المنفذ
netstat -tulpn | grep 3000

# إعادة تشغيل PM2
pm2 restart dama-home-frontend
```

### مشكلة 3: مشكلة في قاعدة البيانات

```bash
# التحقق من الاتصال
php artisan tinker
# DB::connection()->getPdo();

# إعادة تشغيل Migrations
php artisan migrate:fresh --force
php artisan db:seed --force
```

### مشكلة 4: مشكلة في الذاكرة

```bash
# زيادة الذاكرة لـ Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## ✅ Checklist النشر

### Backend

-   [ ] استنساخ المشروع من GitHub
-   [ ] تثبيت Composer Dependencies
-   [ ] إنشاء ملف .env
-   [ ] تعديل إعدادات قاعدة البيانات
-   [ ] توليد APP_KEY
-   [ ] إعداد الصلاحيات (storage, bootstrap/cache)
-   [ ] تشغيل Migrations
-   [ ] تشغيل Seeders
-   [ ] إنشاء Storage Link
-   [ ] تحسين الأداء (cache)

### Frontend

-   [ ] تثبيت Node.js 18+
-   [ ] تثبيت npm Dependencies
-   [ ] إنشاء ملف .env.local
-   [ ] تعديل NEXT_PUBLIC_API_URL
-   [ ] بناء المشروع (npm run build)
-   [ ] تثبيت PM2
-   [ ] تشغيل التطبيق باستخدام PM2

### Server

-   [ ] إعداد Nginx
-   [ ] إعداد SSL Certificate
-   [ ] إعداد Cron Jobs
-   [ ] إعداد Queue Worker (اختياري)
-   [ ] التحقق من عمل الموقع

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع السجلات:
    - Laravel: `tail -f backend/storage/logs/laravel.log`
    - Next.js: `pm2 logs dama-home-frontend`
    - Nginx: `sudo tail -f /var/log/nginx/error.log`
2. تواصل مع دعم Hostinger
3. راجع الوثائق الرسمية

---

**ملاحظات مهمة:**

-   استبدل `yourdomain.com` و `/home/username/` بالقيم الخاصة بك
-   تأكد من تحديث جميع المتغيرات في ملفات `.env` و `.env.local`
-   احفظ نسخة احتياطية من قاعدة البيانات بانتظام
-   راقب استخدام الموارد (Memory, CPU)

**تم النشر بنجاح! 🎉**
