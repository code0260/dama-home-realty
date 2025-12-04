# تعليمات إصلاح الموقع على Hostinger

## الخطوات السريعة

أنت الآن متصل على SSH. نفّذ الأوامر التالية بالترتيب:

### 1. انتقل إلى المجلد الرئيسي

```bash
cd ~/domains/damahomerealty.com/public_html
```

### 2. إصلاح ملف .htaccess في الجذر

```bash
cat > .htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On

    <IfModule mod_proxy.c>
        ProxyPreserveHost On
        ProxyRequests Off
    </IfModule>

    # API Routes - Forward to Laravel Backend
    RewriteCond %{REQUEST_URI} ^/api [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ backend/public/index.php [L]

    # Admin Panel - Forward to Laravel Backend
    RewriteCond %{REQUEST_URI} ^/admin [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^admin/(.*)$ backend/public/index.php [L]

    # Storage Files
    RewriteCond %{REQUEST_URI} ^/storage [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^storage/(.*)$ backend/storage/app/public/$1 [L]

    # Laravel Public Files
    RewriteCond %{REQUEST_URI} ^/(favicon\.ico|robots\.txt) [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^(.*)$ backend/public/$1 [L]

    # Next.js Static Files
    RewriteCond %{REQUEST_URI} ^/_next/static [NC]
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

    # All other requests - Proxy to Next.js
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api [NC]
    RewriteCond %{REQUEST_URI} !^/admin [NC]
    RewriteCond %{REQUEST_URI} !^/storage [NC]
    RewriteCond %{REQUEST_URI} !^/backend [NC]
    RewriteCond %{REQUEST_URI} !^/public [NC]
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
EOF
```

### 3. إصلاح صلاحيات Laravel

```bash
chmod -R 755 backend/storage
chmod -R 755 backend/bootstrap/cache
```

### 4. مسح كاش Laravel

```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
cd ..
```

### 5. التحقق من Frontend وإصلاحه

```bash
# التحقق من وجود frontend
if [ ! -d "frontend" ]; then
    echo "Creating frontend directory..."
    mkdir -p frontend
fi

# نسخ الملفات من .next/standalone إذا كانت موجودة
if [ -d ".next/standalone/backend/frontend" ]; then
    echo "Copying frontend from .next/standalone..."
    cp -r .next/standalone/backend/frontend/* frontend/
fi

# نسخ .next directory
if [ -d ".next" ] && [ ! -d "frontend/.next" ]; then
    echo "Copying .next directory..."
    cp -r .next frontend/
fi

# إصلاح الصلاحيات
chmod -R 755 frontend
```

### 6. إعادة تشغيل Frontend مع PM2

```bash
# إيقاف Frontend القديم
pm2 stop frontend 2>/dev/null || true
pm2 delete frontend 2>/dev/null || true

# تشغيل Frontend الجديد
if [ -f "frontend/server.js" ]; then
    cd frontend
    pm2 start server.js --name frontend --interpreter node
    pm2 save
    cd ..
    echo "Frontend started!"
else
    echo "ERROR: frontend/server.js not found!"
    echo "Please check if the build files are in the correct location"
fi
```

### 7. التحقق من الحالة

```bash
# عرض حالة PM2
pm2 list

# عرض السجلات
pm2 logs frontend --lines 20

# اختبار Laravel API
curl -I http://localhost/api/properties

# اختبار Next.js
curl -I http://localhost:3000
```

## إذا واجهت مشاكل

### المشكلة: frontend/server.js not found

```bash
# ابحث عن server.js
find . -name "server.js" -type f

# إذا وجدته في مكان آخر، انسخه
# مثال:
# cp .next/standalone/backend/frontend/server.js frontend/
```

### المشكلة: .next directory not found

```bash
# ابحث عن .next
find . -name ".next" -type d

# إذا وجدته، انسخه إلى frontend
# مثال:
# cp -r .next frontend/
```

### المشكلة: PM2 not found

```bash
# تثبيت PM2
npm install -g pm2
```

### المشكلة: Laravel routes return 404

```bash
# تأكد من أن .htaccess في الجذر صحيح
cat .htaccess

# تأكد من أن backend/public/index.php موجود
ls -la backend/public/index.php

# اختبر Laravel مباشرة
cd backend
php artisan route:list | grep api
```

## بعد الإصلاح

1. افتح الموقع: https://damahomerealty.com
2. اختبر API: https://damahomerealty.com/api/properties
3. اختبر Admin: https://damahomerealty.com/admin
4. راجع السجلات: `pm2 logs frontend`
