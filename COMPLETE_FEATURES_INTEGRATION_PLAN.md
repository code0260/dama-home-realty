# 🚀 خطة شاملة لضمان اكتمال وربط جميع الميزات

## 📌 الملخص التنفيذي

هذه الخطة تضمن أن جميع الميزات المضافة موجودة بشكل **كامل** وليس فقط واجهات، وأنها **مربوطة بشكل صحيح** بين:

-   ✅ Frontend (Next.js)
-   ✅ Backend API (Laravel)
-   ✅ Database (MySQL)
-   ✅ Admin Dashboard (Filament)

---

## 🔍 المرحلة 1: التحقق من الربط الحالي

### 1.1 ✅ Frontend → Backend API

#### Properties Management

-   ✅ **Create Property**: `POST /api/properties` → `PropertyController@store`
-   ✅ **Update Property**: `PUT /api/properties/{id}` → `PropertyController@update`
-   ✅ **Delete Property**: `DELETE /api/properties/{id}` → `PropertyController@destroy`
-   ✅ **Get Properties**: `GET /api/properties` → `PropertyController@index`
-   ✅ **Get Property**: `GET /api/properties/{slug}` → `PropertyController@show`

**التحقق المطلوب**:

-   [ ] ✅ اختبار إرسال FormData مع الصور
-   [ ] ✅ اختبار Draft mode (status=draft)
-   [ ] ✅ اختبار Validation errors
-   [ ] ✅ اختبار Authentication required
-   [ ] ✅ اختبار Image upload and optimization

#### Bookings Management

-   ✅ **Create Booking**: `POST /api/bookings` → `BookingController@store`
-   ✅ **Get Bookings**: `GET /api/bookings` → `BookingController@index`
-   ✅ **Update Booking**: `PUT /api/bookings/{id}` → `BookingController@update`
-   ✅ **Delete Booking**: `DELETE /api/bookings/{id}` → `BookingController@destroy`

**التحقق المطلوب**:

-   [ ] ✅ اختبار Availability check
-   [ ] ✅ اختبار Payment integration
-   [ ] ✅ اختبار Booking status updates

#### Services Management

-   ✅ **Get Services**: `GET /api/services` → `ServiceController@index`
-   ✅ **Submit Service Request**: `POST /api/leads` → `LeadController@store`

**التحقق المطلوب**:

-   [ ] ✅ اختبار Service request form
-   [ ] ✅ اختبار File upload for services
-   [ ] ✅ اختبار Calendar integration

#### Contact & Leads

-   ✅ **Submit Contact**: `POST /api/contact` → `ContactController@store`
-   ✅ **Submit Lead**: `POST /api/leads` → `LeadController@store`

**التحقق المطلوب**:

-   [ ] ✅ اختبار Multi-step contact form
-   [ ] ✅ اختبار Auto-response emails

---

### 1.2 ⚠️ Backend API → Database

#### Properties Table Schema

-   ✅ **Base Columns**: id, uuid, slug, title, description, price, currency, type
-   ✅ **Location**: neighborhood_id, full_address, latitude, longitude
-   ✅ **Details**: bedrooms, bathrooms, area_sqm, amenities, images
-   ✅ **Contact**: owner_contact, **owner_name**, **owner_email**
-   ✅ **Status**: status (ENUM: active, sold, rented, **pending**, **draft**)
-   ✅ **Metadata**: reference_id, agent_id, is_verified, is_featured
-   ✅ **Tenant Details**: wifi_password, door_code, house_rules

**التحقق المطلوب**:

-   [ ] ⚠️ **تشغيل Migration**: `php artisan migrate` (لإضافة owner_name, owner_email, status enum)
-   [ ] ✅ التحقق من أن جميع الحقول موجودة في Migration
-   [ ] ✅ التحقق من أن Property Model `fillable` يشمل جميع الحقول
-   [ ] ✅ التحقق من Casts (JSON fields: title, description, amenities, images)

#### Bookings Table Schema

-   ✅ **Base**: id, property_id, user_id, check_in, check_out
-   ✅ **Payment**: total_price, amount_paid, payment_status
-   ✅ **Status**: booking_status
-   ✅ **Metadata**: stripe_checkout_session_id, notes

**التحقق المطلوب**:

-   [ ] ✅ التحقق من Foreign Keys
-   [ ] ✅ التحقق من Indexes

#### Services Table Schema

-   ✅ **Base**: id, name, description, price, duration
-   ✅ **Details**: category, availability, locations, packages, faq

**التحقق المطلوب**:

-   [ ] ✅ التحقق من أن جميع الحقول موجودة

---

### 1.3 ⚠️ Admin Dashboard → Backend

#### Filament Resources

**Properties Resource** (`PropertyResource.php`):

-   ✅ **Table**: List, Search, Filter, Sort
-   ✅ **Form**: Create, Edit
-   ✅ **Actions**: Delete, Bulk Actions
-   ✅ **Status Filter**: Filter by status (active, sold, rented)

**التحقق المطلوب**:

-   [ ] ⚠️ **إضافة Status Filter للـ Draft و Pending**
-   [ ] ⚠️ **إضافة Bulk Actions**: Approve (pending → active), Reject (pending → draft)
-   [ ] ⚠️ **إضافة Custom Actions**: Preview property, View analytics
-   [ ] ✅ التحقق من Image Upload في Admin Panel
-   [ ] ✅ التحقق من Translatable fields (title, description)

**Bookings Resource** (`BookingResource.php`):

-   ✅ **Table**: List bookings with filters
-   ✅ **Form**: Edit booking status
-   ✅ **Actions**: Confirm, Cancel

**التحقق المطلوب**:

-   [ ] ✅ التحقق من Booking Status Management
-   [ ] ✅ التحقق من Payment Status Display

**Leads Resource** (`LeadResource.php`):

-   ✅ **Table**: List leads
-   ✅ **Form**: Update lead status
-   ✅ **Actions**: Contact, Close

**التحقق المطلوب**:

-   [ ] ✅ التحقق من Lead Status Management
-   [ ] ✅ التحقق من Service Request Display

**Services Resource**:

-   ✅ **Table**: List services
-   ✅ **Form**: Create, Edit services
-   ✅ **Actions**: Manage availability

**التحقق المطلوب**:

-   [ ] ✅ التحقق من Service Management

---

## 🎯 المرحلة 2: إصلاح وتكامل المشاكل المكتشفة

### 2.1 ⚠️ Database Migration (حرج - يجب تنفيذه)

```bash
cd backend
php artisan migrate
```

**ما سيتم إضافته**:

1. ✅ `owner_name` column (nullable string)
2. ✅ `owner_email` column (nullable string)
3. ✅ `status` enum محدث: `['active', 'sold', 'rented', 'pending', 'draft']`

**بعد Migration**:

-   [ ] ✅ التحقق من أن الحقول موجودة في Database
-   [ ] ✅ اختبار Create Property مع owner_name و owner_email
-   [ ] ✅ اختبار Draft mode (status=draft)
-   [ ] ✅ اختبار Pending status (status=pending)

---

### 2.2 ⚠️ Admin Dashboard Enhancements

#### A. Properties Resource Updates

**إضافة Status Filters**:

```php
// في PropertyResource.php
public static function table(Table $table): Table
{
    return $table
        ->filters([
            SelectFilter::make('status')
                ->options([
                    'active' => 'Active',
                    'pending' => 'Pending Review',
                    'draft' => 'Draft',
                    'sold' => 'Sold',
                    'rented' => 'Rented',
                ]),
            // ... existing filters
        ]);
}
```

**إضافة Bulk Actions**:

```php
->bulkActions([
    BulkActionGroup::make([
        BulkAction::make('approve')
            ->label('Approve Selected')
            ->icon('heroicon-o-check-circle')
            ->requiresConfirmation()
            ->action(function (Collection $records) {
                $records->each->update(['status' => 'active']);
            }),
        BulkAction::make('reject')
            ->label('Reject Selected')
            ->icon('heroicon-o-x-circle')
            ->requiresConfirmation()
            ->action(function (Collection $records) {
                $records->each->update(['status' => 'draft']);
            }),
    ]),
])
```

**إضافة Custom Actions**:

```php
->actions([
    Action::make('preview')
        ->label('Preview')
        ->icon('heroicon-o-eye')
        ->url(fn ($record) => route('properties.show', $record->slug))
        ->openUrlInNewTab(),
    Action::make('analytics')
        ->label('Analytics')
        ->icon('heroicon-o-chart-bar')
        ->modalContent(fn ($record) => view('filament.properties.analytics', ['property' => $record])),
])
```

**إضافة Status Badge**:

```php
->columns([
    // ... existing columns
    Tables\Columns\TextColumn::make('status')
        ->badge()
        ->color(fn (string $state): string => match ($state) {
            'active' => 'success',
            'pending' => 'warning',
            'draft' => 'gray',
            'sold' => 'danger',
            'rented' => 'info',
            default => 'gray',
        })
        ->formatStateUsing(fn (string $state): string => match ($state) {
            'active' => 'Active',
            'pending' => 'Pending Review',
            'draft' => 'Draft',
            'sold' => 'Sold',
            'rented' => 'Rented',
            default => $state,
        }),
])
```

---

### 2.3 ✅ API Endpoints Verification

#### Properties API

**GET /api/properties**:

-   ✅ Filters: type, min_price, max_price, neighborhood_id, bedrooms, bathrooms, featured, verified
-   ⚠️ **إضافة Filter**: status (active, pending, draft, sold, rented)
-   ✅ Pagination
-   ✅ Search
-   ✅ Sorting

**POST /api/properties**:

-   ✅ Validation: `StorePropertyRequest`
-   ✅ Image upload
-   ✅ Image optimization
-   ✅ Draft mode support
-   ✅ Status default: 'pending'

**PUT /api/properties/{id}**:

-   ✅ Authorization check
-   ✅ Validation
-   ✅ Image update
-   ✅ Status update

**DELETE /api/properties/{id}**:

-   ✅ Authorization check
-   ✅ Image deletion
-   ✅ Property deletion

---

### 2.4 ⚠️ Frontend Components Verification

#### MultiStepPropertyForm

**التحقق من**:

-   [ ] ✅ FormData creation صحيح
-   [ ] ✅ Images upload صحيح
-   [ ] ✅ Draft save يعمل
-   [ ] ✅ Error handling صحيح
-   [ ] ✅ Success message يظهر
-   [ ] ✅ Redirect بعد النجاح

**تحسينات مطلوبة**:

-   [ ] ⚠️ إضافة Progress Indicator أفضل
-   [ ] ⚠️ إضافة Image Preview قبل Upload
-   [ ] ⚠️ إضافة Validation Feedback أفضل
-   [ ] ⚠️ إضافة Auto-save Indicator

---

## 🔧 المرحلة 3: إصلاحات وإضافات مطلوبة

### 3.1 ⚠️ Database Schema Updates

#### إضافة Migration للتأكد من كل شيء

```php
// 2025_11_23_090000_verify_properties_table_complete.php
public function up(): void
{
    Schema::table('properties', function (Blueprint $table) {
        // Verify owner_name exists
        if (!Schema::hasColumn('properties', 'owner_name')) {
            $table->string('owner_name')->nullable()->after('owner_contact');
        }

        // Verify owner_email exists
        if (!Schema::hasColumn('properties', 'owner_email')) {
            $table->string('owner_email')->nullable()->after('owner_name');
        }

        // Verify status enum supports all values
        // (This will be handled by the previous migration)
    });
}
```

---

### 3.2 ⚠️ API Response Updates

#### PropertyResource - إضافة جميع الحقول

```php
public function toArray(Request $request): array
{
    return [
        // ... existing fields
        'owner_name' => $this->owner_name ?? null,
        'owner_email' => $this->owner_email ?? null,
        'status' => $this->status,
        'wifi_password' => $this->wifi_password ?? null, // Only for bookings
        'door_code' => $this->door_code ?? null, // Only for bookings
        'house_rules' => $this->house_rules ?? null, // Only for bookings
        'full_address' => $this->full_address ?? null,
        // ... rest of fields
    ];
}
```

---

### 3.3 ⚠️ Admin Dashboard - إضافة Analytics

#### Properties Analytics Widget

```php
// app/Filament/Widgets/PropertiesOverview.php
class PropertiesOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Properties', Property::count())
                ->description('All properties')
                ->descriptionIcon('heroicon-m-home')
                ->color('primary'),
            Stat::make('Pending Review', Property::where('status', 'pending')->count())
                ->description('Awaiting approval')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
            Stat::make('Active Properties', Property::where('status', 'active')->count())
                ->description('Available now')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('Draft Properties', Property::where('status', 'draft')->count())
                ->description('Incomplete listings')
                ->descriptionIcon('heroicon-m-document')
                ->color('gray'),
        ];
    }
}
```

---

## 📋 المرحلة 4: خطة التطوير الشاملة

### 4.1 🏠 Home Page (`app/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Featured Properties → `GET /api/properties?featured=true`
-   [ ] ✅ Latest News → `GET /api/articles`
-   [ ] ✅ Testimonials → `GET /api/testimonials`
-   [ ] ✅ Statistics → يجب إضافة API endpoint أو استخدام البيانات المحلية

#### إضافات مطلوبة:

**Hero Section**:

-   [ ] **Parallax Scrolling**: استخدام `framer-motion` مع `useScroll`
-   [ ] **Video Background**: إضافة `<video>` element مع fallback image
-   [ ] **Animated Statistics**: Component جاهز (`AnimatedStats.tsx`) - يحتاج API endpoint
-   [ ] **Trust Badges**: Component جاهز (`TrustBadges.tsx`) - يحتاج API endpoint
-   [ ] **Quick Search Suggestions**: Component جاهز (`SearchSuggestions.tsx`) - يحتاج API endpoint

**Featured Properties**:

-   [ ] **View Toggle**: Component جاهز (`ViewToggle`) - يحتاج localStorage persistence
-   [ ] **Infinite Scroll**: Logic موجود - يحتاج API pagination
-   [ ] **Skeleton Loading**: Component جاهز (`LoadingSkeleton`) - يحتاج تطبيق
-   [ ] **Filter Chips**: يحتاج implementation

**Performance**:

-   [ ] ✅ Image Optimization: `next/image` مستخدم
-   [ ] ✅ Code Splitting: Dynamic imports مستخدمة
-   [ ] ✅ Lazy Loading: Components lazy loaded
-   [ ] ⚠️ Service Worker: موجود لكن يحتاج تفعيل

---

### 4.2 🏘️ Properties Listing Page (`app/properties/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Filters → `GET /api/properties` with query params
-   [ ] ✅ Property Grid → `PropertyCard` component
-   [ ] ✅ Sort Options → API sorting
-   [ ] ✅ Pagination → API pagination

#### إضافات مطلوبة:

**Filters**:

-   [ ] **Advanced Filters**:
    -   Map bounds filter → يحتاج Google Maps API integration
    -   Draw area → يحتاج Google Maps DrawingManager
    -   Price range slider → Component موجود (`Slider`) - يحتاج تطبيق
    -   Multiple amenities → Component موجود (`Checkbox`) - يحتاج تطبيق
-   [ ] **Saved Filters**: localStorage implementation
-   [ ] **Filter Presets**: Frontend logic
-   [ ] **Active Filter Count**: Component موجود (`ActiveFiltersCount`) - يحتاج تطبيق

**View Options**:

-   [ ] ✅ **View Toggle**: Component موجود (`ViewToggle`)
-   [ ] ✅ **View Persistence**: localStorage موجود
-   [ ] ✅ **Grid Columns**: Component موجود (`GridColumnsSelector`)
-   [ ] ⚠️ **Map View**: يحتاج Google Maps API integration

**Property Cards**:

-   [ ] ✅ **Quick View**: Component موجود (`QuickViewDialog`)
-   [ ] ✅ **Compare**: Component موجود (`CompareProperties`)
-   [ ] ✅ **Share**: Component موجود (`ShareProperty`)
-   [ ] ⚠️ **Wishlist**: يحتاج API endpoint و localStorage
-   [ ] ⚠️ **Virtual Tour Badge**: يحتاج property data field

---

### 4.3 🏡 Property Details Page (`app/properties/[slug]/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Property Data → `GET /api/properties/{slug}`
-   [ ] ✅ Similar Properties → `GET /api/properties?similar_to={uuid}`
-   [ ] ✅ Nearby Properties → `GET /api/properties?nearby={lat},{lng}`
-   [ ] ✅ Availability → `GET /api/properties/{slug}/availability`
-   [ ] ✅ Booking → `POST /api/bookings`

#### إضافات مطلوبة:

**Image Gallery**:

-   [ ] ✅ **Lightbox**: Component موجود (`EnhancedImageGallery`)
-   [ ] ⚠️ **360° View**: يحتاج 360° images في Database
-   [ ] ⚠️ **Virtual Tour**: يحتاج tour URL في Database
-   [ ] ⚠️ **Floor Plans**: يحتاج floor_plans field في Database
-   [ ] ✅ **Download**: Feature موجود في `EnhancedImageGallery`

**Property Information**:

-   [ ] ✅ **Expandable Sections**: Component موجود (`ExpandableSection`)
-   [ ] ✅ **Timeline**: Component موجود (`PropertyTimeline`)
-   [ ] ✅ **Price History**: Component موجود (`PriceHistory`)
-   [ ] ✅ **Similar Properties**: Component موجود (`SimilarProperties`)
-   [ ] ✅ **Nearby Properties**: Component موجود (`NearbyProperties`)
-   [ ] ✅ **Neighborhood Info**: Component موجود (`NeighborhoodInfo`)

**Interactive Features**:

-   [ ] ✅ **Live Chat**: Component موجود (`LiveChat`)
-   [ ] ✅ **Video Call**: Component موجود (`VideoCallButton`)
-   [ ] ⚠️ **360° Tour**: يحتاج tour URL في Database
-   [ ] ⚠️ **AR Preview**: يحتاج AR integration
-   [ ] ✅ **WhatsApp**: Feature موجود

**Booking**:

-   [ ] ✅ **Availability Calendar**: Component موجود
-   [ ] ✅ **Price Calculator**: Component موجود (`PriceCalculator`)
-   [ ] ✅ **Booking Terms**: Component موجود (`BookingTerms`)
-   [ ] ⚠️ **Instant Booking**: يحتاج payment integration

---

### 4.4 💼 Services Page (`app/services/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Services List → `GET /api/services`
-   [ ] ✅ Service Details → `GET /api/services/{slug}`
-   [ ] ✅ Service Request → `POST /api/leads` (type: service_request)

#### إضافات مطلوبة:

**Service Form**:

-   [ ] ✅ **Multi-Step Form**: Component موجود (`MultiStepServiceForm`)
-   [ ] ✅ **File Upload**: Feature موجود
-   [ ] ✅ **Calendar Integration**: Feature موجود
-   [ ] ✅ **Auto-fill**: Feature موجود
-   [ ] ⚠️ **Service Packages**: يحتاج packages data في Database

**Service Details**:

-   [ ] ✅ **Service Pages**: Route موجود (`app/services/[slug]/page.tsx`)
-   [ ] ✅ **FAQ**: Component موجود (`FAQSection`)
-   [ ] ✅ **Reviews**: Component موجود (`ServiceReviews`)
-   [ ] ✅ **Packages**: Component موجود (`ServicePackages`)
-   [ ] ✅ **Availability**: Component موجود (`ServiceAvailability`)
-   [ ] ✅ **Locations**: Component موجود (`ServiceLocations`)

---

### 4.5 👥 About Us Page (`app/about/page.tsx`)

#### التحقق من الربط:

-   [ ] ⚠️ Team Members → يحتاج API endpoint أو استخدام static data
-   [ ] ⚠️ Company Stats → يحتاج API endpoint أو استخدام static data
-   [ ] ⚠️ Story Timeline → يحتاج API endpoint أو استخدام static data

#### إضافات مطلوبة:

**Story Section**:

-   [ ] ✅ **Story Section**: Component موجود (`StorySection`)
-   [ ] ✅ **Timeline**: Component موجود (`InteractiveTimeline`)
-   [ ] ✅ **Video Story**: Component موجود (`VideoStory`)
-   [ ] ✅ **Mission & Vision**: Component موجود (`MissionVision`)

**Team Section**:

-   [ ] ✅ **Team Cards**: Component موجود (`TeamMemberCard`)
-   [ ] ✅ **Team Hierarchy**: Component موجود (`TeamHierarchy`)
-   [ ] ✅ **Team Achievements**: Component موجود (`TeamAchievements`)
-   [ ] ⚠️ **Team Details**: Component موجود (`TeamMemberDetails`) - يحتاج route

**Stats**:

-   [ ] ✅ **Animated Counter**: Component موجود (`StatsCounter`)
-   [ ] ✅ **Visualization**: Component موجود (`StatsVisualization`)
-   [ ] ✅ **Values**: Component موجود (`CompanyValues`)
-   [ ] ✅ **Awards**: Component موجود (`AwardsRecognition`)

---

### 4.6 📰 Blog Page (`app/blog/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Articles List → `GET /api/articles`
-   [ ] ✅ Article Details → `GET /api/articles/{slug}`
-   [ ] ✅ Comments → يحتاج API endpoint (`POST /api/articles/{slug}/comments`)
-   [ ] ✅ Subscribe → يحتاج API endpoint (`POST /api/subscribe`)

#### إضافات مطلوبة:

**Blog Listing**:

-   [ ] ✅ **Featured Post**: Component موجود (`FeaturedPost`)
-   [ ] ✅ **Filters**: Component موجود (`BlogFilters`)
-   [ ] ✅ **Cards**: Component موجود (`BlogCard`)
-   [ ] ✅ **Pagination**: موجود

**Blog Post**:

-   [ ] ✅ **Table of Contents**: Component موجود (`TableOfContents`)
-   [ ] ✅ **Share**: Component موجود (`ShareButtons`)
-   [ ] ✅ **Related**: Component موجود (`RelatedPosts`)
-   [ ] ✅ **Comments**: Component موجود (`CommentsSection`)
-   [ ] ✅ **Author Bio**: Component موجود (`AuthorBio`)
-   [ ] ✅ **Subscribe**: Component موجود (`SubscribeForm`)

---

### 4.7 📞 Contact Page (`app/contact/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Contact Form → `POST /api/contact`
-   [ ] ✅ Live Chat → يحتاج WebSocket أو polling
-   [ ] ✅ Map → Google Maps API

#### إضافات مطلوبة:

**Contact Form**:

-   [ ] ✅ **Multi-Step**: Component موجود (`MultiStepContactForm`)
-   [ ] ✅ **File Upload**: Feature موجود
-   [ ] ⚠️ **Auto-response**: يحتاج Email service configuration

**Contact Info**:

-   [ ] ✅ **Map**: Component موجود (`InteractiveMap`)
-   [ ] ✅ **Info**: Component موجود (`ContactInformation`)
-   [ ] ✅ **Live Chat**: Component موجود (`LiveChatWidget`)

---

### 4.8 🔐 Login/Register Pages

#### التحقق من الربط:

-   [ ] ✅ Login → `POST /api/login`
-   [ ] ✅ Register → `POST /api/register`
-   [ ] ✅ Social Login → يحتاج OAuth configuration
-   [ ] ✅ 2FA → يحتاج API endpoint

#### إضافات مطلوبة:

**Login**:

-   [ ] ✅ **Social Login**: Component موجود (`SocialLogin`)
-   [ ] ✅ **Forgot Password**: Component موجود (`ForgotPassword`)
-   [ ] ✅ **2FA**: Component موجود (`TwoFactorAuth`)
-   [ ] ⚠️ **Login History**: Component موجود لكن يحتاج API endpoint

**Register**:

-   [ ] ✅ **Multi-Step**: Component موجود (`MultiStepRegistration`)
-   [ ] ✅ **Email Verification**: Feature موجود
-   [ ] ✅ **Phone Verification**: Feature موجود

---

### 4.9 📝 List Property Page (`app/list-property/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Property Form → `POST /api/properties` أو `PUT /api/properties/{id}`
-   [ ] ✅ Draft Save → `POST /api/properties` with status=draft
-   [ ] ✅ Image Upload → FormData multipart

#### إضافات مطلوبة:

**Property Form**:

-   [ ] ✅ **Multi-Step**: Component موجود (`MultiStepPropertyForm`)
-   [ ] ✅ **Draft Save**: Feature موجود (auto-save + manual)
-   [ ] ✅ **Image Upload**: Feature موجود
-   [ ] ✅ **Location Picker**: Component موجود (`LocationPicker`)
-   [ ] ⚠️ **Price Suggestions**: يحتاج ML model أو API endpoint

**Property Management**:

-   [ ] ⚠️ **Edit Property**: يحتاج route و page (`/list-property/edit/{id}`)
-   [ ] ⚠️ **Analytics**: يحتاج API endpoint (`GET /api/properties/{id}/analytics`)
-   [ ] ⚠️ **View Count**: يحتاج API endpoint لتتبع المشاهدات

---

### 4.10 👤 Tenant Portal (`app/portal/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Bookings → `GET /api/bookings`
-   [ ] ✅ Services → `GET /api/my-services`
-   [ ] ✅ Profile → `GET /api/user`

#### إضافات مطلوبة:

**Dashboard**:

-   [ ] ✅ **Sidebar**: Component موجود (`PortalSidebar`)
-   [ ] ✅ **Boarding Pass**: Component موجود (`BoardingPassCard`)
-   [ ] ⚠️ **Analytics**: يحتاج API endpoint

**Bookings**:

-   [ ] ✅ **List**: موجود
-   [ ] ✅ **Details**: موجود
-   [ ] ⚠️ **Modify**: يحتاج API endpoint (`PUT /api/bookings/{id}`)

**Services**:

-   [ ] ✅ **Requests**: موجود
-   [ ] ✅ **Status**: موجود
-   [ ] ⚠️ **Ratings**: يحتاج API endpoint

---

### 4.11 🗺️ Map Search Page (`app/map-search/page.tsx`)

#### التحقق من الربط:

-   [ ] ✅ Properties → `GET /api/properties`
-   [ ] ✅ Map → Google Maps API
-   [ ] ⚠️ Clusters → يحتاج Google Maps MarkerClusterer
-   [ ] ⚠️ Heatmap → يحتاج Google Maps HeatmapLayer

#### إضافات مطلوبة:

**Map Features**:

-   [ ] ✅ **Full-Screen**: موجود
-   [ ] ⚠️ **Clusters**: يحتاج library installation
-   [ ] ⚠️ **Heatmap**: يحتاج data processing
-   [ ] ⚠️ **Draw Area**: يحتاج Google Maps DrawingManager
-   [ ] ⚠️ **Route Planning**: يحتاج Google Maps Directions API

---

### 4.12 💳 Payment Pages

#### التحقق من الربط:

-   [ ] ✅ Checkout → `POST /api/bookings/{id}/checkout`
-   [ ] ✅ Payment Verify → `GET /api/bookings/{id}/payment/verify`
-   [ ] ✅ Webhook → `POST /api/webhooks/stripe`

#### إضافات مطلوبة:

**Payment Page**:

-   [ ] ✅ **Methods**: Component موجود (`PaymentMethods`)
-   [ ] ✅ **Progress**: Component موجود (`PaymentProgress`)
-   [ ] ✅ **Security**: Component موجود (`PaymentSecurity`)
-   [ ] ✅ **Summary**: Component موجود (`BookingSummary`)

**Payment Success**:

-   [ ] ✅ **Confirmation**: موجود
-   [ ] ✅ **Summary**: موجود
-   [ ] ⚠️ **Email Receipt**: يحتاج Email service configuration

---

## 🗄️ المرحلة 5: Database Schema Verification

### 5.1 Properties Table - Complete Schema

```sql
-- التحقق من جميع الحقول موجودة:
- id (INT, PRIMARY KEY)
- uuid (VARCHAR, UNIQUE)
- slug (VARCHAR, UNIQUE)
- title (JSON) -- {en: "...", ar: "..."}
- description (JSON) -- {en: "...", ar: "..."}
- price (DECIMAL(12,2))
- currency (ENUM: USD, SYP)
- type (ENUM: rent, sale, hotel)
- neighborhood_id (INT, FOREIGN KEY)
- agent_id (INT, FOREIGN KEY, nullable)
- bedrooms (INT)
- bathrooms (INT)
- area_sqm (INT)
- is_verified (BOOLEAN, default: false)
- is_featured (BOOLEAN, default: false)
- amenities (JSON) -- ["wifi", "parking", ...]
- images (JSON) -- ["path1", "path2", ...]
- video_url (VARCHAR, nullable)
- owner_contact (VARCHAR)
- owner_name (VARCHAR, nullable) ✅ NEW
- owner_email (VARCHAR, nullable) ✅ NEW
- status (ENUM: active, sold, rented, pending, draft) ✅ UPDATED
- reference_id (VARCHAR, UNIQUE, nullable)
- wifi_password (VARCHAR, nullable)
- door_code (VARCHAR, nullable)
- house_rules (TEXT, nullable)
- full_address (TEXT, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔐 المرحلة 6: Admin Dashboard Integration

### 6.1 Filament Resources - Complete List

#### ✅ Existing Resources:

1. **PropertyResource** - ✅ موجود
2. **BookingResource** - ✅ موجود
3. **LeadResource** - ✅ موجود
4. **ServiceResource** - ✅ موجود (يحتاج التحقق)
5. **ArticleResource** - ✅ موجود (يحتاج التحقق)
6. **AgentResource** - ✅ موجود (يحتاج التحقق)
7. **NeighborhoodResource** - ✅ موجود (يحتاج التحقق)

#### ⚠️ Missing Resources (قد تحتاج):

1. **UserResource** - لإدارة المستخدمين
2. **TestimonialResource** - لإدارة الشهادات
3. **ContactResource** - لإدارة رسائل التواصل

---

### 6.2 Admin Dashboard Widgets

#### إضافة Widgets:

```php
// Properties Overview Widget
class PropertiesOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Properties', Property::count()),
            Stat::make('Pending Review', Property::where('status', 'pending')->count()),
            Stat::make('Active Properties', Property::where('status', 'active')->count()),
            Stat::make('Draft Properties', Property::where('status', 'draft')->count()),
        ];
    }
}

// Recent Properties Widget
class RecentProperties extends TableWidget
{
    protected function getTableQuery(): Builder
    {
        return Property::query()->latest()->limit(10);
    }

    protected function getTableColumns(): array
    {
        return [
            TextColumn::make('title'),
            TextColumn::make('status')->badge(),
            TextColumn::make('created_at')->dateTime(),
        ];
    }
}

// Bookings Overview Widget
class BookingsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Bookings', Booking::count()),
            Stat::make('Pending Bookings', Booking::where('booking_status', 'pending')->count()),
            Stat::make('Confirmed Bookings', Booking::where('booking_status', 'confirmed')->count()),
            Stat::make('Total Revenue', Booking::sum('total_price')),
        ];
    }
}
```

---

## 📝 المرحلة 7: Action Plan - خطوات التنفيذ

### Step 1: ⚠️ Database Migration (حرج - أولوية قصوى)

```bash
cd backend
php artisan migrate
```

**التحقق بعد Migration**:

```sql
-- في MySQL
DESCRIBE properties;
-- يجب أن ترى: owner_name, owner_email, status enum محدث
```

---

### Step 2: ⚠️ Admin Dashboard Updates

#### A. Update PropertyResource.php

**إضافة Status Filter**:

```php
SelectFilter::make('status')
    ->options([
        'active' => 'Active',
        'pending' => 'Pending Review',
        'draft' => 'Draft',
        'sold' => 'Sold',
        'rented' => 'Rented',
    ])
```

**إضافة Status Badge**:

```php
TextColumn::make('status')
    ->badge()
    ->color(fn (string $state): string => match ($state) {
        'active' => 'success',
        'pending' => 'warning',
        'draft' => 'gray',
        'sold' => 'danger',
        'rented' => 'info',
        default => 'gray',
    })
```

**إضافة Bulk Actions**:

```php
BulkAction::make('approve')
    ->label('Approve Selected')
    ->action(fn (Collection $records) => $records->each->update(['status' => 'active']))
```

---

### Step 3: ✅ API Endpoints Verification

#### Test All Endpoints:

```bash
# Properties
curl -X GET http://localhost:8000/api/properties
curl -X POST http://localhost:8000/api/properties -H "Authorization: Bearer TOKEN" -F "title=Test" ...
curl -X PUT http://localhost:8000/api/properties/1 -H "Authorization: Bearer TOKEN" ...
curl -X DELETE http://localhost:8000/api/properties/1 -H "Authorization: Bearer TOKEN"

# Bookings
curl -X GET http://localhost:8000/api/bookings -H "Authorization: Bearer TOKEN"

# Services
curl -X GET http://localhost:8000/api/services
```

---

### Step 4: ✅ Frontend Components Testing

#### Test Property Form:

1. **Create Property**:

    - [ ] Fill all fields
    - [ ] Upload images
    - [ ] Save as draft
    - [ ] Submit for review (status=pending)
    - [ ] Check success message
    - [ ] Check redirect

2. **Draft Save**:

    - [ ] Fill partial form
    - [ ] Wait 5 seconds (auto-save)
    - [ ] Check localStorage
    - [ ] Check API call (if authenticated)

3. **Validation**:
    - [ ] Try submit empty form
    - [ ] Check error messages
    - [ ] Try invalid email
    - [ ] Check validation

---

### Step 5: ⚠️ Missing API Endpoints

#### Endpoints Needed:

1. **Property Analytics**:

    ```
    GET /api/properties/{id}/analytics
    Response: { views: 100, saves: 20, inquiries: 5, ... }
    ```

2. **Property Views Tracking**:

    ```
    POST /api/properties/{id}/view
    Response: { success: true }
    ```

3. **Wishlist**:

    ```
    GET /api/user/wishlist
    POST /api/properties/{id}/wishlist
    DELETE /api/properties/{id}/wishlist
    ```

4. **Comments**:

    ```
    GET /api/articles/{slug}/comments
    POST /api/articles/{slug}/comments
    ```

5. **Subscribe**:
    ```
    POST /api/subscribe
    ```

---

## ✅ Checklist النهائي

### Database ✅

-   [ ] ⚠️ Migration تم تشغيله
-   [ ] ✅ جميع الحقول موجودة
-   [ ] ✅ Foreign keys صحيحة
-   [ ] ✅ Indexes موجودة

### Backend API ✅

-   [ ] ✅ جميع Routes موجودة
-   [ ] ✅ Controllers تعمل
-   [ ] ✅ Validation صحيحة
-   [ ] ✅ Resources تعيد جميع البيانات

### Frontend ✅

-   [ ] ✅ جميع Components موجودة
-   [ ] ✅ API calls صحيحة
-   [ ] ✅ Error handling موجود
-   [ ] ✅ Loading states موجودة

### Admin Dashboard ⚠️

-   [ ] ⚠️ Status filters محدثة
-   [ ] ⚠️ Bulk actions موجودة
-   [ ] ⚠️ Widgets موجودة
-   [ ] ✅ Resources تعمل

### Integration ✅

-   [ ] ✅ Frontend → Backend
-   [ ] ✅ Backend → Database
-   [ ] ⚠️ Admin → Backend (يحتاج تحديثات)

---

## 🎯 الأولويات (Priority Order)

### 🔴 Critical (يجب تنفيذه الآن):

1. ⚠️ **تشغيل Migration**: `php artisan migrate`
2. ⚠️ **تحديث Admin Dashboard**: إضافة Status filters و Bulk actions
3. ⚠️ **اختبار Property Creation**: التأكد من أن كل شيء يعمل

### 🟡 High (يجب تنفيذه قريباً):

4. ⚠️ **إضافة Missing API Endpoints**: Analytics, Views, Wishlist
5. ⚠️ **تحسين Error Handling**: رسائل خطأ أفضل
6. ⚠️ **إضافة Widgets للـ Admin Dashboard**

### 🟢 Medium (يمكن تنفيذه لاحقاً):

7. ⚠️ **تحسينات UI/UX**: Animations, Transitions
8. ⚠️ **Performance Optimizations**: Caching, Lazy Loading
9. ⚠️ **Analytics Integration**: Google Analytics, Tracking

---

**تاريخ الخطة**: 23 نوفمبر 2025  
**الحالة**: 🟡 **في التطوير - يحتاج إلى إصلاحات**
