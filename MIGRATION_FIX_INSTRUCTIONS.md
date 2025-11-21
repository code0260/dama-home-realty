# إصلاح Migration و Activity Log

## المشكلة

1. Migration الـ indexes تعمل قبل migrations إنشاء الجداول
2. الحزمة `spatie/laravel-activitylog` غير مثبتة

## الحل

### 1. تثبيت Activity Log Package

```bash
cd backend
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migration"
php artisan migrate
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-config"
```

### 2. إعادة ترتيب Migration الـ Indexes

تم تغيير اسم migration من:

- `2025_01_21_000001_add_indexes_to_tables.php`

إلى:

- `2025_11_21_000001_add_indexes_to_tables.php`

هذا يضمن أن migration الـ indexes تعمل **بعد** جميع migrations إنشاء الجداول.

### 3. تشغيل Migrations

```bash
cd backend
php artisan migrate:fresh --seed
```

## ترتيب Migrations الصحيح

1. ✅ `0001_01_01_000000_create_users_table`
2. ✅ `0001_01_01_000001_create_cache_table`
3. ✅ `0001_01_01_000002_create_jobs_table`
4. ✅ `2025_11_18_214854_create_personal_access_tokens_table`
5. ✅ `2025_11_18_215327_create_properties_table`
6. ✅ `2025_11_18_220013_create_neighborhoods_table`
7. ✅ `2025_11_18_220022_create_leads_table`
8. ✅ `2025_11_18_220031_update_properties_table_for_enterprise`
9. ✅ `2025_11_18_232752_create_permission_tables`
10. ✅ `2025_11_18_232800_create_bookings_table`
11. ✅ `2025_11_19_000338_create_agents_table`
12. ✅ `2025_11_19_000350_create_services_table`
13. ✅ `2025_11_19_000359_create_testimonials_table`
14. ✅ `2025_11_19_000425_add_agent_and_reference_to_properties_table`
15. ✅ `2025_11_19_000440_add_type_to_leads_table`
16. ✅ `2025_11_19_003416_add_tenant_details_to_properties_table`
17. ✅ `2025_11_20_230603_create_articles_table`
18. ✅ `2025_11_20_231336_create_notifications_table`
19. ✅ `2025_11_21_000001_add_indexes_to_tables` ← **الآن بعد إنشاء جميع الجداول**

## Models التي تستخدم Activity Log

- ✅ `Property.php` - LogsActivity trait
- ✅ `Booking.php` - LogsActivity trait
- ✅ `Lead.php` - LogsActivity trait

## التحقق

بعد تثبيت الحزمة وتشغيل migrations، يجب أن يعمل كل شيء بدون أخطاء.
