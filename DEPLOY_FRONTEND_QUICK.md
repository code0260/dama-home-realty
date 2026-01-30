# 🚀 نشر Frontend على Hostinger - دليل سريع

## 📋 الطريقة السريعة (3 خطوات)

### 1️⃣ على جهازك المحلي - تشغيل السكريبت

```powershell
# في PowerShell
.\deploy_frontend_to_hostinger.ps1
```

**أو مع خيارات:**

```powershell
# تخطي البناء (إذا كان مبني مسبقاً)
.\deploy_frontend_to_hostinger.ps1 -SkipBuild

# تخطي الرفع (إذا أردت رفع الملف يدوياً)
.\deploy_frontend_to_hostinger.ps1 -SkipUpload

# كلاهما
.\deploy_frontend_to_hostinger.ps1 -SkipBuild -SkipUpload
```

---

### 2️⃣ على السيرفر - تشغيل السكريبت

```bash
# رفع السكريبت إلى السيرفر (إن لم يكن موجوداً)
scp deploy_on_server.sh u646739138@92.112.189.198:~/domains/damahomerealty.com/public_html/backend/frontend/

# الاتصال بالسيرفر
ssh u646739138@92.112.189.198

# الانتقال إلى المجلد
cd ~/domains/damahomerealty.com/public_html/backend/frontend

# إعطاء صلاحيات التنفيذ
chmod +x deploy_on_server.sh

# تشغيل السكريبت
./deploy_on_server.sh
```

---

### 3️⃣ التحقق من النجاح

```bash
# على السيرفر
pm2 status
pm2 logs nextjs

# في المتصفح
https://damahomerealty.com
```

---

## 📝 الطريقة اليدوية

### إذا لم يعمل السكريبت التلقائي:

#### على جهازك المحلي:
```powershell
# 1. ضغط الملفات
cd backend\frontend
tar -czf ..\..\frontend-build-ready.tar.gz .next public package.json next.config.js

# 2. رفع الملف (SCP أو FileZilla)
scp ..\..\frontend-build-ready.tar.gz u646739138@92.112.189.198:~/domains/damahomerealty.com/public_html/backend/frontend/
```

#### على السيرفر:
```bash
# 1. الانتقال إلى المجلد
cd ~/domains/damahomerealty.com/public_html/backend/frontend

# 2. فك الضغط
tar -xzf frontend-build-ready.tar.gz

# 3. حذف الملف المضغوط
rm frontend-build-ready.tar.gz

# 4. إعادة تشغيل PM2
pm2 restart nextjs
# أو
pm2 restart dama-frontend

# 5. التحقق
pm2 status
pm2 logs nextjs
```

---

## ⚙️ إعدادات مخصصة

يمكنك تعديل الإعدادات في `deploy_frontend_to_hostinger.ps1`:

```powershell
param(
    [string]$ServerUser = "u646739138",           # اسم المستخدم
    [string]$ServerIP = "92.112.189.198",          # IP السيرفر
    [string]$ServerPath = "~/domains/...",         # مسار السيرفر
)
```

---

## 🔧 حل المشاكل

### المشكلة: SCP غير متوفر
**الحل:** استخدم FileZilla أو أي برنامج FTP لرفع الملف يدوياً

### المشكلة: PM2 لا يعمل
**الحل:** 
```bash
# التحقق من التطبيقات
pm2 list

# إعادة تشغيل بالاسم الصحيح
pm2 restart <app-name>
```

### المشكلة: خطأ في فك الضغط
**الحل:** 
```bash
# تحقق من وجود الملف
ls -lh frontend-build-ready.tar.gz

# تحقق من المساحة
df -h
```

---

## ✅ Checklist

- [ ] تم بناء المشروع (`npm run build`)
- [ ] تم ضغط الملفات
- [ ] تم رفع الملف على السيرفر
- [ ] تم فك الضغط على السيرفر
- [ ] تم إعادة تشغيل PM2
- [ ] الموقع يعمل بشكل صحيح

---

**🎉 تم النشر بنجاح!**

