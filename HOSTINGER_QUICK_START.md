# 🚀 دليل النشر السريع على Hostinger

## 📋 الخطوات الأساسية (Quick Start)

### 1️⃣ إعداد قاعدة البيانات
```bash
# من hPanel > Databases > MySQL Databases
# أنشئ قاعدة بيانات جديدة واحفظ:
# - Database Name
# - Username  
# - Password
```

### 2️⃣ الاتصال عبر SSH
```bash
ssh username@yourdomain.com
cd ~/domains/yourdomain.com/public_html
```

### 3️⃣ استنساخ المشروع
```bash
git clone https://github.com/code0260/dama-home-realty.git .
```

### 4️⃣ إعداد Backend (Laravel)
```bash
cd backend

# تثبيت Composer Dependencies
composer install --no-dev --optimize-autoloader

# إنشاء .env
cp .env.example .env
nano .env  # عدّل إعدادات قاعدة البيانات

# توليد APP_KEY
php artisan key:generate

# إعداد الصلاحيات
chmod -R 775 storage bootstrap/cache

# تشغيل Migrations
php artisan migrate --force

# إنشاء Storage Link
php artisan storage:link

# تحسين الأداء
php artisan optimize
```

### 5️⃣ إعداد Frontend (Next.js)
```bash
cd frontend

# تثبيت Dependencies
npm install --production

# إنشاء .env.local
nano .env.local
# أضف: NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# بناء المشروع
npm run build

# تثبيت PM2
npm install -g pm2

# تشغيل التطبيق
pm2 start npm --name "dama-frontend" -- start
pm2 save
pm2 startup
```

### 6️⃣ إعداد Nginx
```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
# انسخ التكوين من HOSTINGER_COMPLETE_DEPLOYMENT_GUIDE.md

sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7️⃣ إعداد SSL
```bash
# من hPanel > SSL > Let's Encrypt
# أو
sudo certbot --nginx -d yourdomain.com
```

### 8️⃣ إعداد Cron Jobs
```bash
crontab -e
# أضف:
* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## ✅ Checklist سريع

- [ ] قاعدة بيانات جاهزة
- [ ] Backend مثبت ومكوّن
- [ ] Frontend مبني ويعمل
- [ ] Nginx مكوّن
- [ ] SSL مثبت
- [ ] Cron Jobs مفعلة
- [ ] الموقع يعمل على https://yourdomain.com

---

## 🔧 الأوامر السريعة

```bash
# إعادة تشغيل Frontend
pm2 restart dama-frontend

# إعادة تحميل Backend
php artisan optimize

# عرض السجلات
pm2 logs dama-frontend
tail -f backend/storage/logs/laravel.log
```

---

**للمزيد من التفاصيل، راجع:** `HOSTINGER_COMPLETE_DEPLOYMENT_GUIDE.md`

