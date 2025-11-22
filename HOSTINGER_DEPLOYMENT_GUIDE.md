# 🚀 دليل النشر على Hostinger (Deployment Guide)

## 📋 متطلبات النشر

### 1. متطلبات الخادم (Server Requirements)
- **Node.js**: الإصدار 18.x أو أحدث
- **npm** أو **yarn**: لإدارة الحزم
- **Git**: لسحب الكود من GitHub
- **PM2** أو **forever**: لتشغيل التطبيق بشكل مستمر
- **Nginx** أو **Apache**: كخادم ويب عكسي (Reverse Proxy)

---

## 🔧 خطوات النشر على Hostinger

### الخطوة 1: التحضير للخادم (Server Setup)

#### أ. تسجيل الدخول إلى Hostinger
1. اذهب إلى [hPanel](https://hpanel.hostinger.com/)
2. سجل الدخول بحسابك
3. افتح **File Manager** أو استخدم **SSH Terminal**

#### ب. تثبيت Node.js
```bash
# التحقق من إصدار Node.js
node -v

# إذا لم يكن مثبتاً، قم بتثبيته عبر nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### ج. تثبيت PM2 (Process Manager)
```bash
npm install -g pm2
```

---

### الخطوة 2: سحب الكود من GitHub

#### أ. الانتقال إلى مجلد التطبيق
```bash
cd ~/domains/yourdomain.com/public_html
# أو
cd ~/public_html
```

#### ب. استنساخ المشروع من GitHub
```bash
# إذا كان المجلد فارغاً
git clone https://github.com/code0260/dama-home-realty.git .

# أو إذا كان المجلد موجوداً بالفعل
git clone https://github.com/code0260/dama-home-realty.git temp
cp -r temp/* .
rm -rf temp
```

#### ج. الانتقال إلى مجلد Frontend
```bash
cd backend/frontend
```

---

### الخطوة 3: تثبيت الحزم والاعتماديات

```bash
# تثبيت الحزم
npm install

# أو إذا كنت تستخدم yarn
yarn install
```

---

### الخطوة 4: تكوين متغيرات البيئة (.env)

#### أ. إنشاء ملف `.env.local`
```bash
cd backend/frontend
nano .env.local
```

#### ب. إضافة المتغيرات التالية:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
# أو رابط API الخاص بك
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# VAPID Keys (لـ Push Notifications - اختياري)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key

# Environment
NODE_ENV=production

# Database (إذا كان مطلوباً)
# DATABASE_URL=your_database_url
```

#### ج. حفظ الملف
- اضغط `Ctrl + X` ثم `Y` ثم `Enter`

---

### الخطوة 5: بناء التطبيق (Build)

```bash
# بناء التطبيق للإنتاج
npm run build

# أو
yarn build
```

**ملاحظة**: هذه العملية قد تستغرق 5-10 دقائق

---

### الخطوة 6: تشغيل التطبيق باستخدام PM2

#### أ. إنشاء ملف تكوين PM2
```bash
nano ecosystem.config.js
```

#### ب. إضافة المحتوى التالي:
```javascript
module.exports = {
  apps: [
    {
      name: 'dama-home-realty',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/username/domains/yourdomain.com/public_html/backend/frontend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
```

#### ج. إنشاء مجلد السجلات
```bash
mkdir -p logs
```

#### د. تشغيل التطبيق
```bash
# تشغيل التطبيق
pm2 start ecosystem.config.js

# أو مباشرة
pm2 start npm --name "dama-home-realty" -- start

# حفظ قائمة PM2
pm2 save

# إعداد PM2 للبدء تلقائياً عند إعادة تشغيل السيرفر
pm2 startup
```

---

### الخطوة 7: تكوين Nginx كخادم ويب عكسي

#### أ. إنشاء ملف تكوين Nginx
```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
```

#### ب. إضافة التكوين التالي:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # إعادة التوجيه من HTTP إلى HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # شهادات SSL (يمكن الحصول عليها من Hostinger أو Let's Encrypt)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # إعدادات SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # حجم أقصى لرفع الملفات
    client_max_body_size 50M;

    # ملفات ثابتة (Static Files)
    location /_next/static {
        alias /home/username/domains/yourdomain.com/public_html/backend/frontend/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        alias /home/username/domains/yourdomain.com/public_html/backend/frontend/public/images;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /icon-192x192.png {
        alias /home/username/domains/yourdomain.com/public_html/backend/frontend/public/icon-192x192.png;
        add_header Cache-Control "public, max-age=31536000";
    }

    # التطبيق الرئيسي
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
        
        # إعدادات مهلة الاتصال
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

#### ج. تفعيل التكوين
```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

# التحقق من صحة التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

---

### الخطوة 8: إعداد SSL Certificate

#### أ. باستخدام Let's Encrypt (مجاني)
```bash
# تثبيت Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# إعداد التجديد التلقائي
sudo certbot renew --dry-run
```

#### ب. أو استخدام SSL من Hostinger
1. اذهب إلى **hPanel** > **SSL**
2. اختر **Let's Encrypt** أو شهادة أخرى
3. اتبع التعليمات لإعداد SSL

---

### الخطوة 9: التحقق من التطبيق

#### أ. التحقق من حالة PM2
```bash
pm2 status
pm2 logs dama-home-realty
```

#### ب. التحقق من Nginx
```bash
sudo systemctl status nginx
```

#### ج. فتح المتصفح
- اذهب إلى `https://yourdomain.com`
- تحقق من أن الموقع يعمل بشكل صحيح

---

## 🔄 التحديثات المستقبلية

### سحب التحديثات من GitHub

```bash
cd ~/domains/yourdomain.com/public_html/backend/frontend

# سحب التحديثات
git pull origin main

# تثبيت الحزم الجديدة (إن وجدت)
npm install

# إعادة بناء التطبيق
npm run build

# إعادة تشغيل PM2
pm2 restart dama-home-realty
```

---

## 🛠️ الأوامر المفيدة

### PM2 Commands
```bash
# عرض حالة التطبيقات
pm2 status

# عرض السجلات
pm2 logs dama-home-realty

# إعادة تشغيل التطبيق
pm2 restart dama-home-realty

# إيقاف التطبيق
pm2 stop dama-home-realty

# حذف التطبيق من PM2
pm2 delete dama-home-realty

# عرض معلومات مفصلة
pm2 show dama-home-realty

# مراقبة التطبيق
pm2 monit
```

### Git Commands
```bash
# عرض حالة Git
git status

# سحب التحديثات
git pull origin main

# عرض الفروع
git branch -a

# تغيير الفرع
git checkout main
```

### Nginx Commands
```bash
# التحقق من التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx

# إعادة تشغيل Nginx
sudo systemctl restart nginx

# عرض السجلات
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔍 حل المشاكل الشائعة

### المشكلة 1: التطبيق لا يعمل
```bash
# التحقق من PM2
pm2 status
pm2 logs dama-home-realty

# التحقق من المنفذ
netstat -tulpn | grep 3000

# إعادة تشغيل PM2
pm2 restart dama-home-realty
```

### المشكلة 2: خطأ في البناء (Build Error)
```bash
# مسح مجلد البناء
rm -rf .next

# إعادة تثبيت الحزم
rm -rf node_modules
npm install

# إعادة البناء
npm run build
```

### المشكلة 3: مشكلة في الذاكرة
```bash
# زيادة الذاكرة المتاحة لـ Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### المشكلة 4: خطأ 502 Bad Gateway
```bash
# التحقق من أن التطبيق يعمل
pm2 status

# التحقق من Nginx
sudo nginx -t
sudo systemctl status nginx

# التحقق من المنفذ
netstat -tulpn | grep 3000
```

---

## 📊 مراقبة الأداء

### عرض استخدام الموارد
```bash
# استخدام PM2 Monitor
pm2 monit

# أو استخدام htop
htop
```

### عرض السجلات
```bash
# سجلات PM2
pm2 logs dama-home-realty --lines 100

# سجلات Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔒 الأمان

### 1. تحديث الحزم بانتظام
```bash
npm audit
npm audit fix
```

### 2. استخدام متغيرات البيئة
- لا تضع أي معلومات حساسة في الكود
- استخدم `.env.local` لجميع المتغيرات الحساسة

### 3. تفعيل Firewall
```bash
# فتح المنافذ المطلوبة فقط
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع سجلات PM2: `pm2 logs dama-home-realty`
2. راجع سجلات Nginx: `sudo tail -f /var/log/nginx/error.log`
3. تواصل مع دعم Hostinger
4. راجع الوثائق الرسمية:
   - [Next.js Deployment](https://nextjs.org/docs/deployment)
   - [PM2 Documentation](https://pm2.keymetrics.io/docs/)
   - [Nginx Documentation](https://nginx.org/en/docs/)

---

## ✅ Checklist النشر

- [ ] تثبيت Node.js 18.x أو أحدث
- [ ] تثبيت PM2
- [ ] استنساخ المشروع من GitHub
- [ ] تثبيت الحزم (`npm install`)
- [ ] إنشاء ملف `.env.local`
- [ ] بناء التطبيق (`npm run build`)
- [ ] تشغيل التطبيق باستخدام PM2
- [ ] تكوين Nginx
- [ ] إعداد SSL Certificate
- [ ] التحقق من عمل الموقع
- [ ] إعداد مراقبة الأداء

---

**ملاحظة**: استبدل `yourdomain.com` و `/home/username/` بالقيم الخاصة بك في جميع الأوامر.

**تم النشر بنجاح! 🎉**

