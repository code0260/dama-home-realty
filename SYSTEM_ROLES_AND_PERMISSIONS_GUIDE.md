# دليل شامل: الأدوار والصلاحيات في نظام Dama Home Realty

## 📋 جدول المحتويات

1. [نظرة عامة على النظام](#نظرة-عامة)
2. [الأدوار (Roles) الموجودة](#الأدوار-الموجودة)
3. [الصلاحيات (Permissions)](#الصلاحيات)
4. [تفاصيل كل دور](#تفاصيل-كل-دور)
5. [كيفية إضافة مستخدمين جدد](#إضافة-مستخدمين-جدد)
6. [كيفية إضافة إيميلات](#إضافة-إيميلات)
7. [أمثلة عملية](#أمثلة-عملية)

---

## 🎯 نظرة عامة على النظام

نظام Dama Home Realty يستخدم **Spatie Laravel Permission** لإدارة الأدوار والصلاحيات. النظام مبني على طبقات (Layers) مختلفة لكل منها صلاحيات محددة.

### البنية الأساسية:

- **2 أدوار رئيسية**: Super Admin و Tenant
- **7 صلاحيات أساسية**: تتحكم في ما يمكن لكل دور فعله
- **Filament Admin Panel**: لوحة تحكم للمدراء فقط
- **API Authentication**: للمستخدمين العاديين (Tenants)

---

## 👥 الأدوار الموجودة

### 1. **Super Admin** (المدير العام)

- **الوصول**: لوحة التحكم (Admin Panel) + API
- **الصلاحيات**: جميع الصلاحيات بدون قيود
- **الاستخدام**: إدارة كاملة للنظام

### 2. **Tenant** (العميل/الزبون)

- **الوصول**: API فقط (Frontend)
- **الصلاحيات**: محدودة (مشاهدة وإنشاء الحجوزات فقط)
- **الاستخدام**: حجز العقارات ومتابعة الحجوزات

---

## 🔐 الصلاحيات (Permissions)

### قائمة الصلاحيات الكاملة:

| الصلاحية            | الوصف              | Super Admin | Tenant           |
| ------------------- | ------------------ | ----------- | ---------------- |
| `view bookings`     | مشاهدة الحجوزات    | ✅          | ✅ (حجوزاته فقط) |
| `create bookings`   | إنشاء حجوزات جديدة | ✅          | ✅               |
| `edit bookings`     | تعديل الحجوزات     | ✅          | ✅ (حجوزاته فقط) |
| `delete bookings`   | حذف الحجوزات       | ✅          | ❌               |
| `manage properties` | إدارة العقارات     | ✅          | ❌               |
| `manage users`      | إدارة المستخدمين   | ✅          | ❌               |
| `manage tenants`    | إدارة العملاء      | ✅          | ❌               |

---

## 📖 تفاصيل كل دور

### 🎖️ Super Admin (المدير العام)

#### الوصف:

المدير العام هو المسؤول الكامل عن النظام. لديه صلاحيات كاملة لإدارة جميع جوانب المنصة.

#### الصلاحيات الكاملة:

- ✅ **الوصول إلى Admin Panel** (`/admin`)

  - عرض Dashboard مع الإحصائيات
  - إدارة العقارات (Properties)
  - إدارة الحجوزات (Bookings)
  - إدارة العملاء (Leads)
  - إدارة المستخدمين
  - عرض التقارير والرسوم البيانية

- ✅ **إدارة العقارات**

  - إضافة/تعديل/حذف عقارات
  - تغيير حالة العقار (active, sold, rented)
  - إدارة الصور والتفاصيل
  - إدارة الأحياء (Neighborhoods)

- ✅ **إدارة الحجوزات**

  - عرض جميع الحجوزات
  - تعديل أي حجز
  - حذف الحجوزات
  - تغيير حالة الحجز والدفع
  - إرسال إشعارات للعملاء

- ✅ **إدارة المستخدمين**

  - إضافة مستخدمين جدد
  - تعديل بيانات المستخدمين
  - حذف المستخدمين
  - تغيير الأدوار والصلاحيات

- ✅ **إدارة العملاء (Leads)**

  - عرض جميع طلبات الاستفسار
  - تغيير حالة الطلبات
  - إرسال إشعارات

- ✅ **الوصول إلى API**
  - جميع الـ endpoints متاحة
  - بدون قيود

#### كيفية الوصول:

```
URL: http://localhost:8000/admin
Email: admin@dama-home.com
Password: admin123
```

#### الكود المسؤول:

```php
// في User Model
public function canAccessPanel(\Filament\Panel $panel): bool
{
    return $this->hasRole('Super Admin');
}

// في Controllers
if ($user->hasRole('Super Admin')) {
    // يمكنه فعل أي شيء
}
```

---

### 🏠 Tenant (العميل/الزبون)

#### الوصف:

العميل هو المستخدم العادي الذي يسجل في الموقع لاستئجار أو شراء عقارات. لديه صلاحيات محدودة.

#### الصلاحيات:

- ✅ **إنشاء حساب جديد**

  - التسجيل عبر `/register`
  - الحصول على دور Tenant تلقائياً

- ✅ **مشاهدة العقارات**

  - تصفح جميع العقارات المتاحة
  - البحث والفلترة
  - عرض تفاصيل العقارات
  - حفظ العقارات المفضلة

- ✅ **إنشاء حجوزات**

  - حجز عقارات للإيجار (rent)
  - حجز فنادق (hotel)
  - اختيار تواريخ الإقامة
  - دفع العربون (Deposit)

- ✅ **متابعة حجوزاته**

  - عرض حجوزاته فقط (ليس حجوزات الآخرين)
  - تعديل حجوزاته (قبل التأكيد)
  - عرض حالة الدفع
  - الوصول إلى تفاصيل العقار المحجوز (WiFi, Door Code, etc.)

- ✅ **الوصول إلى Portal**

  - صفحة `/portal` لمتابعة الحجوزات
  - عرض الخدمات المطلوبة

- ❌ **ما لا يمكنه فعله:**
  - الوصول إلى Admin Panel
  - حذف الحجوزات
  - إدارة العقارات
  - إدارة المستخدمين
  - رؤية حجوزات الآخرين

#### كيفية الوصول:

```
URL: http://localhost:3000 (Frontend)
التسجيل: /register
تسجيل الدخول: /login
Portal: /portal (بعد تسجيل الدخول)
```

#### الكود المسؤول:

```php
// في BookingController
if ($request->user() && $request->user()->hasRole('Tenant')) {
    $query->where('user_id', $request->user()->id); // فقط حجوزاته
}

// في AuthController
if (!$user->hasRole('Tenant')) {
    $user->assignRole('Tenant'); // تعيين تلقائي عند التسجيل
}
```

---

## ➕ إضافة مستخدمين جدد

### الطريقة 1: عبر Admin Panel (Filament)

1. **تسجيل الدخول كـ Super Admin**

   ```
   URL: http://localhost:8000/admin
   ```

2. **الذهاب إلى Users**

   - من القائمة الجانبية، اختر "Users"
   - اضغط "New User"

3. **ملء البيانات**

   - Name: اسم المستخدم
   - Email: البريد الإلكتروني
   - Password: كلمة المرور
   - Email Verified At: تاريخ التحقق (اختياري)

4. **تعيين الدور**
   - بعد إنشاء المستخدم، اذهب إلى "Roles"
   - اختر الدور المناسب:
     - **Super Admin**: للمدراء
     - **Tenant**: للعملاء

### الطريقة 2: عبر Seeder (للمطورين)

أنشئ ملف seeder جديد:

```php
// database/seeders/CreateUsersSeeder.php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateUsersSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء Super Admin جديد
        $admin = User::create([
            'name' => 'Ahmed Al-Khatib',
            'email' => 'ahmed@dama-home.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Super Admin');

        // إنشاء عملاء (Tenants)
        $tenant1 = User::create([
            'name' => 'Mohammed Ali',
            'email' => 'mohammed@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $tenant1->assignRole('Tenant');

        $tenant2 = User::create([
            'name' => 'Fatima Hassan',
            'email' => 'fatima@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
        $tenant2->assignRole('Tenant');
    }
}
```

**تشغيل Seeder:**

```bash
php artisan db:seed --class=CreateUsersSeeder
```

### الطريقة 3: عبر Tinker (سريع)

```bash
php artisan tinker
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

// إنشاء Super Admin
$admin = User::create([
    'name' => 'New Admin',
    'email' => 'newadmin@dama-home.com',
    'password' => Hash::make('admin123'),
    'email_verified_at' => now(),
]);
$admin->assignRole('Super Admin');

// إنشاء Tenant
$tenant = User::create([
    'name' => 'New Tenant',
    'email' => 'tenant@example.com',
    'password' => Hash::make('password123'),
    'email_verified_at' => now(),
]);
$tenant->assignRole('Tenant');
```

### الطريقة 4: عبر API (للتسجيل التلقائي)

المستخدمون يمكنهم التسجيل تلقائياً عبر:

```
POST /api/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["Tenant"]
    }
  },
  "message": "Registration successful"
}
```

> **ملاحظة**: عند التسجيل عبر API، يتم تعيين دور `Tenant` تلقائياً.

---

## 📧 إضافة إيميلات

### إضافة إيميلات للـ Admins

#### الطريقة 1: عبر Admin Panel

1. اذهب إلى `/admin`
2. اختر "Users" من القائمة
3. اضغط "New User"
4. أدخل:
   - **Name**: اسم المدير
   - **Email**: البريد الإلكتروني (مثلاً: `manager@dama-home.com`)
   - **Password**: كلمة مرور قوية
5. بعد الإنشاء، اذهب إلى "Roles" واختر "Super Admin"

#### الطريقة 2: عبر Seeder

```php
// database/seeders/AddAdminEmailsSeeder.php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AddAdminEmailsSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Manager 1',
                'email' => 'manager1@dama-home.com',
                'password' => Hash::make('secure_password_123'),
            ],
            [
                'name' => 'Manager 2',
                'email' => 'manager2@dama-home.com',
                'password' => Hash::make('secure_password_456'),
            ],
            [
                'name' => 'Support Team',
                'email' => 'support@dama-home.com',
                'password' => Hash::make('support_password_789'),
            ],
        ];

        foreach ($admins as $adminData) {
            $admin = User::firstOrCreate(
                ['email' => $adminData['email']],
                array_merge($adminData, [
                    'email_verified_at' => now(),
                ])
            );

            if (!$admin->hasRole('Super Admin')) {
                $admin->assignRole('Super Admin');
            }
        }
    }
}
```

**تشغيل:**

```bash
php artisan db:seed --class=AddAdminEmailsSeeder
```

### إضافة إيميلات للعملاء (Tenants)

#### الطريقة 1: التسجيل الذاتي

العملاء يسجلون بأنفسهم عبر:

- Frontend: `/register`
- API: `POST /api/register`

#### الطريقة 2: إنشاء حسابات يدوياً

```php
// database/seeders/AddTenantEmailsSeeder.php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AddTenantEmailsSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = [
            [
                'name' => 'Customer 1',
                'email' => 'customer1@example.com',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Customer 2',
                'email' => 'customer2@example.com',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($tenants as $tenantData) {
            $tenant = User::firstOrCreate(
                ['email' => $tenantData['email']],
                array_merge($tenantData, [
                    'email_verified_at' => now(),
                ])
            );

            if (!$tenant->hasRole('Tenant')) {
                $tenant->assignRole('Tenant');
            }
        }
    }
}
```

#### الطريقة 3: عبر Admin Panel

1. اذهب إلى `/admin`
2. اختر "Users" → "New User"
3. أدخل بيانات العميل
4. الدور سيتم تعيينه تلقائياً كـ "Tenant" (أو يمكنك تعيينه يدوياً)

---

## 🔍 أمثلة عملية

### مثال 1: إضافة مدير جديد

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::create([
    'name' => 'Ahmed Manager',
    'email' => 'ahmed.manager@dama-home.com',
    'password' => Hash::make('SecurePass123!'),
    'email_verified_at' => now(),
]);

$admin->assignRole('Super Admin');
```

### مثال 2: التحقق من صلاحيات المستخدم

```php
$user = User::find(1);

// التحقق من الدور
if ($user->hasRole('Super Admin')) {
    // يمكنه الوصول إلى Admin Panel
}

// التحقق من الصلاحية
if ($user->can('manage properties')) {
    // يمكنه إدارة العقارات
}

// الحصول على جميع الأدوار
$roles = $user->getRoleNames(); // ['Super Admin']

// الحصول على جميع الصلاحيات
$permissions = $user->getAllPermissions();
```

### مثال 3: تغيير دور المستخدم

```php
$user = User::where('email', 'user@example.com')->first();

// إزالة جميع الأدوار
$user->removeRole('Tenant');

// إضافة دور جديد
$user->assignRole('Super Admin');

// أو تغيير الدور
$user->syncRoles(['Super Admin']);
```

### مثال 4: إنشاء صلاحية جديدة

```php
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

// إنشاء صلاحية جديدة
$permission = Permission::create(['name' => 'manage agents']);

// إضافة الصلاحية لـ Super Admin
$superAdmin = Role::findByName('Super Admin');
$superAdmin->givePermissionTo('manage agents');
```

---

## 📊 جدول مقارنة سريع

| الميزة                     | Super Admin | Tenant           |
| -------------------------- | ----------- | ---------------- |
| **الوصول إلى Admin Panel** | ✅          | ❌               |
| **الوصول إلى Frontend**    | ✅          | ✅               |
| **إنشاء حساب**             | ✅ (يدوياً) | ✅ (تسجيل ذاتي)  |
| **مشاهدة العقارات**        | ✅ (جميعها) | ✅ (المتاحة فقط) |
| **إنشاء حجوزات**           | ✅          | ✅               |
| **مشاهدة الحجوزات**        | ✅ (جميعها) | ✅ (حجوزاته فقط) |
| **تعديل الحجوزات**         | ✅ (جميعها) | ✅ (حجوزاته فقط) |
| **حذف الحجوزات**           | ✅          | ❌               |
| **إدارة العقارات**         | ✅          | ❌               |
| **إدارة المستخدمين**       | ✅          | ❌               |
| **إدارة العملاء**          | ✅          | ❌               |
| **عرض التقارير**           | ✅          | ❌               |

---

## 🛡️ الأمان

### أفضل الممارسات:

1. **كلمات المرور القوية**

   - استخدم كلمات مرور معقدة للـ Admins
   - الحد الأدنى: 8 أحرف، أرقام، رموز

2. **Email Verification**

   - تأكد من تفعيل `email_verified_at` للمستخدمين الجدد
   - يمكن إضافة middleware للتحقق من الإيميل

3. **Rate Limiting**

   - API محمي بـ rate limiting
   - Login: 10 requests/minute
   - Other endpoints: 60 requests/minute

4. **CSRF Protection**

   - جميع POST/PUT/DELETE requests محمية
   - CSRF token مطلوب

5. **Authorization Checks**
   - كل controller يتحقق من الصلاحيات
   - Policies تستخدم للتحقق من الصلاحيات

---

## 📝 ملاحظات مهمة

1. **تعيين الأدوار تلقائياً:**

   - عند التسجيل عبر API، يتم تعيين دور `Tenant` تلقائياً
   - Super Admin يجب تعيينه يدوياً

2. **الصلاحيات الافتراضية:**

   - Super Admin: جميع الصلاحيات
   - Tenant: `view bookings`, `create bookings` فقط

3. **الوصول إلى Admin Panel:**

   - فقط Super Admin يمكنه الوصول
   - يتم التحقق عبر `canAccessPanel()` method

4. **إدارة الأدوار:**
   - يمكن إضافة أدوار جديدة عبر `Role::create()`
   - يمكن إضافة صلاحيات جديدة عبر `Permission::create()`

---

## 🚀 خطوات سريعة

### إضافة Super Admin جديد:

```bash
php artisan tinker
```

```php
$admin = \App\Models\User::create([
    'name' => 'New Admin',
    'email' => 'admin2@dama-home.com',
    'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
    'email_verified_at' => now(),
]);
$admin->assignRole('Super Admin');
```

### إضافة Tenant جديد:

```php
$tenant = \App\Models\User::create([
    'name' => 'New Customer',
    'email' => 'customer@example.com',
    'password' => \Illuminate\Support\Facades\Hash::make('password123'),
    'email_verified_at' => now(),
]);
$tenant->assignRole('Tenant');
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من أن المستخدم لديه الدور الصحيح
2. تحقق من الصلاحيات المخصصة
3. امسح الـ cache: `php artisan cache:clear`
4. امسح permissions cache: `php artisan permission:cache-reset`

---

**آخر تحديث**: $(date)
**الإصدار**: 1.0.0
