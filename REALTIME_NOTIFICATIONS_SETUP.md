# 🔔 دليل إعداد Real-time Notifications
# Real-time Notifications Setup Guide

## ✅ ما تم إنجازه

### Backend (Laravel)
- ✅ `BookingCreated` Event - يبث عند إنشاء حجز جديد
- ✅ `LeadCreated` Event - يبث عند إنشاء lead جديد
- ✅ Broadcasting Routes - `/broadcasting/auth`
- ✅ Channels Authorization - `admin.notifications` channel
- ✅ Integration في BookingController و LeadController

### Frontend (Next.js)
- ✅ `lib/echo.ts` - Laravel Echo client setup
- ✅ `NotificationProvider` - Real-time notifications component
- ✅ Notification Bell - يظهر في Navbar للـ Super Admins
- ✅ Browser Notifications - دعم browser notifications

---

## 📋 خطوات الإعداد

### 1. تثبيت Laravel Echo و Pusher (Backend)

```bash
cd backend
composer require pusher/pusher-php-server
```

### 2. تثبيت Laravel Echo و Pusher JS (Frontend)

```bash
cd backend/frontend
npm install laravel-echo pusher-js
```

### 3. إعداد Pusher Account

1. اذهب إلى [Pusher](https://pusher.com/)
2. أنشئ حساب جديد
3. أنشئ Channel App جديد
4. انسخ App credentials

### 4. إعداد Environment Variables

#### Backend `.env`:
```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_APP_CLUSTER=mt1
```

#### Frontend `.env.local`:
```env
NEXT_PUBLIC_PUSHER_APP_KEY=your-app-key
NEXT_PUBLIC_PUSHER_APP_CLUSTER=mt1
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🎯 كيفية العمل

### 1. عند إنشاء Booking:
- يتم إرسال `BookingCreated` event
- يتم البث إلى `admin.notifications` channel
- Super Admins يستقبلون Notification فوراً
- Browser notification يظهر (إذا كان مسموح)

### 2. عند إنشاء Lead:
- يتم إرسال `LeadCreated` event
- يتم البث إلى `admin.notifications` channel
- Super Admins يستقبلون Notification فوراً
- Browser notification يظهر (إذا كان مسموح)

---

## 🔧 الملفات المُنشأة

### Backend:
- `app/Events/BookingCreated.php`
- `app/Events/LeadCreated.php`
- `routes/channels.php`
- `config/broadcasting.php`
- `routes/web.php` (محدث)

### Frontend:
- `lib/echo.ts`
- `components/notifications/NotificationProvider.tsx`
- `components/providers.tsx` (محدث)

---

## 📝 ملاحظات

1. **Pusher Free Plan**: يدعم 200K messages/day
2. **Alternative**: يمكن استخدام Laravel WebSockets (بدون Pusher)
3. **Browser Notifications**: تحتاج permission من المستخدم
4. **Security**: فقط Super Admins يمكنهم الاستماع للـ channel

---

## 🚀 الخطوات التالية

1. تثبيت الحزم (composer + npm)
2. إعداد Pusher Account
3. إضافة Environment Variables
4. اختبار Real-time Notifications

---

**آخر تحديث**: الآن
**الحالة**: مكتمل ✅

