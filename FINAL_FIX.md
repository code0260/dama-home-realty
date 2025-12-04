# الإصلاح النهائي - Laravel Routes 404

## المشكلة:
- API و Admin يعطيان 404
- Frontend يعمل بشكل صحيح

## الحل:

نفّذ هذا الأمر على SSH:

```bash
cd ~/domains/damahomerealty.com/public_html

# إصلاح .htaccess
cat > .htaccess << 'HTACCESS_EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On

    <IfModule mod_proxy.c>
        ProxyPreserveHost On
        ProxyRequests Off
    </IfModule>

    # API Routes - Forward to Laravel
    RewriteCond %{REQUEST_URI} ^/api [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ backend/public/index.php [L]

    # Admin Panel - Forward to Laravel
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
HTACCESS_EOF

# التحقق من Laravel routes
cd backend
php artisan route:list | grep -E "(api|admin)" | head -10

# مسح الكاش
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# إعادة تخزين
php artisan route:cache
php artisan config:cache

# اختبار
echo ""
echo "Testing..."
curl -I http://localhost/api/properties 2>/dev/null | head -1
curl -I http://localhost/admin 2>/dev/null | head -1
```

## إذا استمرت المشكلة:

1. تحقق من أن `mod_rewrite` مفعّل:
```bash
php -i | grep mod_rewrite
```

2. تحقق من Laravel routes:
```bash
cd backend
php artisan route:list | grep api
```

3. اختبر Laravel مباشرة:
```bash
cd backend/public
php -S localhost:8001
# ثم في terminal آخر:
curl http://localhost:8001/api/properties
```

