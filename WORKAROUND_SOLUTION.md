# حل بديل - استخدام Laravel Public مباشرة

بما أن `.htaccess` لا يعمل بشكل صحيح مع LiteSpeed، يمكننا استخدام حل بديل:

## الحل 1: تغيير Document Root في Hostinger

1. اذهب إلى Hostinger Control Panel
2. غير Document Root من `public_html` إلى `public_html/backend/public`
3. ثم عدّل `.htaccess` في `backend/public` ليتعامل مع Next.js

## الحل 2: استخدام Subdomain

1. أنشئ subdomain: `api.damahomerealty.com`
2. ضع Document Root على `public_html/backend/public`
3. استخدم `api.damahomerealty.com` للـ API

## الحل 3: استخدام Laravel Routes مباشرة

عدّل `backend/public/.htaccess` ليتعامل مع كل شيء:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # API and Admin - Handle in Laravel
    RewriteCond %{REQUEST_URI} ^/(api|admin) [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.php [L]
    
    # All other - Proxy to Next.js
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

ثم استخدم `https://damahomerealty.com/backend/public/` للوصول إلى Laravel.

