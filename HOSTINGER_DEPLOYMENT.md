# توثيق عملية النشر على Hostinger

## 📋 ملخص

تم نشر تطبيق Dama Home Realty على Hostinger Shared Hosting بنجاح. التطبيق يتكون من:

-   **Laravel Backend** (API + Admin Panel)
-   **Next.js Frontend** (React SSR)
-   **MySQL Database**

---

## 🗂️ هيكل الملفات على السيرفر

```
~/domains/damahomerealty.com/public_html/
├── index.php                    # PHP Router (يوجه الطلبات)
├── .htaccess                    # Apache/LiteSpeed Configuration
├── backend/                     # Laravel Backend
│   ├── public/
│   │   ├── index.php           # Laravel Entry Point
│   │   └── .htaccess           # Laravel Routing
│   ├── storage/
│   │   └── app/public/         # ملفات الصور والملفات المرفوعة
│   └── .env                    # Laravel Environment Variables
└── frontend/                    # Next.js Frontend (Built)
    └── .next/
        └── standalone/
            └── backend/
                └── frontend/
                    ├── server.js    # Next.js Server
                    ├── .next/       # Build Output
                    └── public/      # Static Files
```

---

## 🔧 التكوينات المهمة

### 1. `index.php` (Root Router)

**الموقع**: `public_html/index.php`

**الوظيفة**: يوجه الطلبات إلى:

-   `/api/*` → Laravel Backend
-   `/admin/*` → Laravel Admin Panel
-   `/storage/*` → Laravel Storage Files
-   كل شيء آخر → Next.js Frontend (عبر proxy إلى localhost:3000)

**ملاحظة**: هذا الملف **يجب أن يبقى** في `public_html/` ولا يتم رفعه على Git لأنه خاص بالسيرفر.

### 2. `.htaccess` (Root)

**الموقع**: `public_html/.htaccess`

**الوظيفة**: يوجه كل الطلبات إلى `index.php`

```apache
DirectoryIndex index.php index.html
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.php [L]
</IfModule>
```

### 3. PM2 Configuration

**الموقع**: `~/.pm2/dump.pm2`

**الوظيفة**: تشغيل Next.js على `localhost:3000`

**الأمر**:

```bash
pm2 start /home/u646739138/domains/damahomerealty.com/public_html/frontend/.next/standalone/backend/frontend/server.js --name nextjs
```

### 4. PM2 Keep-Alive Script

**الموقع**: `~/keep_pm2_alive.sh`

**الوظيفة**: يتحقق كل 5 دقائق من أن PM2 يعمل، وإذا توقف يعيد تشغيله

**Cron Job**:

```bash
*/5 * * * * /bin/bash ~/keep_pm2_alive.sh >> ~/pm2_keepalive.log 2>&1
```

---

## 🚀 خطوات النشر (للمستقبل)

### عند رفع تحديثات جديدة:

1. **رفع الملفات على Git**:

    ```bash
    git add .
    git commit -m "Update description"
    git push
    ```

2. **على السيرفر (SSH)**:

    ```bash
    cd ~/domains/damahomerealty.com/public_html
    git pull
    ```

3. **تحديث Laravel**:

    ```bash
    cd backend
    composer install --no-dev --optimize-autoloader
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

4. **بناء Next.js** (على جهازك المحلي):

    ```bash
    cd backend/frontend
    npm install
    npm run build
    ```

5. **رفع Next.js Build**:
    - ضغط الملفات:
        ```bash
        zip -r frontend-build.zip .next/standalone/backend/frontend/.next/static .next/standalone/backend/frontend/public
        ```
    - رفع `frontend-build.zip` إلى `public_html/frontend/`
    - على السيرفر:
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
3. **لا تحذف** `frontend/.next/standalone/` - هذا هو Next.js build
4. **لا ترفع** `.env` على Git
5. **لا ترفع** `index.php` من `public_html/` على Git (خاص بالسيرفر)

### ✅ يجب أن تفعل:

1. **احتفظ** بنسخة احتياطية من `index.php` و `.htaccess`
2. **تحقق** من أن PM2 يعمل: `pm2 list`
3. **راقب** الـ logs: `pm2 logs nextjs`
4. **تحقق** من cron job: `crontab -l`

---

## 🔍 استكشاف الأخطاء

### المشكلة: الموقع لا يعمل

```bash
# 1. تحقق من PM2
pm2 list

# 2. تحقق من Next.js
curl http://localhost:3000

# 3. تحقق من Laravel
curl https://damahomerealty.com/api/properties

# 4. تحقق من الـ logs
pm2 logs nextjs
tail -50 backend/storage/logs/laravel.log
```

### المشكلة: PM2 توقف

```bash
# إعادة التشغيل
cd ~/domains/damahomerealty.com/public_html/frontend/.next/standalone/backend/frontend
pm2 start server.js --name nextjs
pm2 save
```

### المشكلة: الصور لا تظهر

```bash
# 1. تحقق من public folder
ls -la frontend/.next/standalone/backend/frontend/public/

# 2. تحقق من Laravel storage
ls -la backend/storage/app/public/
ls -la backend/public/storage  # يجب أن يكون symlink
```

---

## 📝 معلومات السيرفر

-   **Domain**: damahomerealty.com
-   **Hosting**: Hostinger Shared Hosting
-   **Web Server**: LiteSpeed
-   **PHP Version**: 8.2.28
-   **Node.js Version**: 20.19.5 (via NVM)
-   **Database**: MySQL (u646739138_dama)
-   **SSH Port**: 65002
-   **SSH User**: u646739138@92.112.189.198

---

## 🔐 Environment Variables

### Laravel (`backend/.env`):

```env
APP_URL=https://damahomerealty.com
DB_DATABASE=u646739138_dama
DB_USERNAME=u646739138_manager
DB_PASSWORD=DamaProject@2025
```

### Next.js (`.env.local` - في build):

```env
NEXT_PUBLIC_API_URL=https://damahomerealty.com/api
NEXT_PUBLIC_STORAGE_URL=https://damahomerealty.com/storage
```

---

## 📅 آخر تحديث

**التاريخ**: 29 نوفمبر 2025
**الحالة**: ✅ يعمل بشكل كامل

-   ✅ Laravel API يعمل
-   ✅ Next.js Frontend يعمل
-   ✅ الصور تعمل
-   ✅ PM2 Keep-Alive يعمل

---

## 👤 للتواصل

إذا واجهت أي مشاكل، راجع هذا الملف أولاً. معظم المشاكل الشائعة موثقة هنا.
