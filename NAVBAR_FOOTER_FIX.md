# إصلاح تكرار Navbar و Footer

## المشكلة
- Navbar و Footer موجودان في `app/layout.tsx` (يُطبقان على جميع الصفحات)
- لكن العديد من الصفحات تضيف Navbar و Footer مرة أخرى، مما يسبب التكرار

## الحل
تم إزالة Navbar و Footer من:
- ✅ `app/properties/page.tsx`
- ✅ `app/blog/page.tsx`
- ✅ `app/services/page.tsx`
- ✅ `app/contact/page.tsx`
- ✅ `app/about/page.tsx`
- ✅ `app/list-property/page.tsx`

## الصفحات المتبقية التي تحتاج إصلاح:
- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/portal/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/map-search/page.tsx`
- `app/refund-policy/page.tsx`
- `app/terms/page.tsx`
- `app/privacy-policy/page.tsx`
- `app/bookings/[id]/payment/page.tsx`
- `app/bookings/[id]/payment/success/page.tsx`

## ملاحظة
جميع الصفحات يجب أن تحتوي فقط على المحتوى الخاص بها، لأن Navbar و Footer موجودان في `layout.tsx`.

