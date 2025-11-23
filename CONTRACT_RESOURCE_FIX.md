# ✅ إصلاح ContractResource - Undefined array key 0

## 🔍 المشكلة
`ErrorException: Undefined array key 0` في Filament Select component عند محاولة إنشاء contract جديد.

## 🔍 السبب
المشكلة كانت في `getOptionLabelFromRecordUsing` في `ContractResource`:
- الـ relationship لم يكن يحمّل `property` و `user` بشكل eager
- عند محاولة الوصول إلى `$record->property->getTranslation()` أو `$record->user->name`، كانت العلاقات غير محمّلة
- Filament Select component كان يحاول الوصول إلى array key 0 في options فارغة

## ✅ الحل
1. ✅ إضافة `->with(['property', 'user'])` للـ relationship query لتحميل العلاقات بشكل eager
2. ✅ إضافة null checks في `getOptionLabelFromRecordUsing` للتعامل مع الحالات التي قد تكون فيها العلاقات غير موجودة
3. ✅ استخدام fallback values عند عدم وجود property أو user

## 📝 التعديلات

**backend/app/Filament/Resources/ContractResource.php**:
```php
Forms\Components\Select::make('booking_id')
    ->relationship('booking', 'id', fn ($query) => 
        $query->where('booking_status', 'confirmed')
            ->whereDoesntHave('contract')
            ->with(['property', 'user']) // ✅ إضافة eager loading
    )
    ->required()
    ->searchable()
    ->preload()
    ->getOptionLabelFromRecordUsing(function ($record) {
        if (!$record) {
            return 'Unknown Booking';
        }
        
        $propertyTitle = 'No Property';
        if ($record->property) {
            $propertyTitle = $record->property->getTranslation('title', 'en') 
                ?? $record->property->getTranslation('title', 'ar') 
                ?? 'Unknown Property';
        }
        
        $userName = $record->user?->name ?? 'Unknown User';
        return "Booking #{$record->id} - {$propertyTitle} - {$userName}";
    })
    ->label('Booking'),
```

## ✅ النتيجة
- ✅ Contract creation page يعمل بدون errors
- ✅ Booking select dropdown يعرض البيانات بشكل صحيح
- ✅ لا توجد undefined array key errors

