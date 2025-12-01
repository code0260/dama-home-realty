# 📦 تعليمات الرفع اليدوي - إصلاح الصور

## الخطوة 1: على جهازك (Windows)

### خيار أ: ضغط يدوي
1. افتح مجلد المشروع: `C:\Users\LENOVO\Desktop\dama-home-realty`
2. اضغط على الملفات التالية وارفعها:
   - `backend/frontend/components/ui-custom/PropertyCard.tsx`
   - `backend/frontend/components/ui-custom/NeighborhoodCard.tsx`
   - `backend/frontend/components/property/ImageGallery.tsx`
   - `backend/frontend/components/property/EnhancedImageGallery.tsx`
   - `backend/frontend/components/property/QuickViewDialog.tsx`
   - `backend/frontend/components/payment/BookingSummary.tsx`
   - `backend/frontend/lib/image-optimization.ts`
   - `backend/frontend/app/properties/[slug]/PropertyDetailsClient.tsx`
   - `backend/frontend/app/properties/[slug]/page.tsx`
   - `backend/frontend/next.config.js`
   - `backend/frontend/package.json`
   - `backend/frontend/postcss.config.mjs`

### خيار ب: ضغط كامل (أسهل)
1. اضغط مجلد `backend/frontend` كامل
2. ارفع الملف المضغوط

---

## الخطوة 2: على السيرفر (SSH)

```bash
# 1. الانتقال إلى المجلد
cd ~/domains/damahomerealty.com/public_html

# 2. حل مشكلة Git (إذا كانت موجودة)
git stash
git pull

# 3. إذا رفعت ملف مضغوط:
# unzip -o frontend.zip -d backend/

# 4. الانتقال إلى frontend
cd frontend

# 5. حذف .next القديم
rm -rf .next

# 6. تثبيت dependencies (مهم جداً!)
npm install --omit=dev --legacy-peer-deps

# 7. البناء (مع تعطيل Turbopack)
NEXT_PRIVATE_SKIP_TURBO=1 NEXT_PRIVATE_DISABLE_TURBO=1 npm run build

# 8. إذا فشل البناء، جرب:
rm -rf node_modules .next
npm install --legacy-peer-deps
NEXT_PRIVATE_SKIP_TURBO=1 npm run build

# 9. إعادة تشغيل PM2
pm2 restart nextjs
pm2 save
```

---

## ملاحظات مهمة:

1. **إذا ظهر خطأ `@tailwindcss/postcss`**: 
   ```bash
   cd frontend
   npm install @tailwindcss/postcss --save --legacy-peer-deps
   npm run build
   ```

2. **إذا استمر Turbopack**: 
   ```bash
   # حذف كل شيء وإعادة التثبيت
   rm -rf node_modules .next package-lock.json
   npm install --legacy-peer-deps
   NEXT_PRIVATE_SKIP_TURBO=1 npm run build
   ```

3. **للتحقق من أن الصور تعمل**:
   - افتح: `https://damahomerealty.com/properties/`
   - ارفع صورة من لوحة التحكم
   - تحقق من ظهورها في الموقع

---

## الأوامر السريعة (نسخ ولصق):

```bash
cd ~/domains/damahomerealty.com/public_html && git stash && git pull && cd frontend && rm -rf .next && npm install --omit=dev --legacy-peer-deps && NEXT_PRIVATE_SKIP_TURBO=1 npm run build && pm2 restart nextjs && pm2 save
```

