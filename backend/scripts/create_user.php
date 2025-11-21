<?php

/**
 * Script سريع لإنشاء مستخدم جديد
 * 
 * الاستخدام:
 * php create_user.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== إنشاء مستخدم جديد ===\n\n";

// الحصول على البيانات من المستخدم
echo "الاسم: ";
$name = trim(fgets(STDIN));

echo "البريد الإلكتروني: ";
$email = trim(fgets(STDIN));

echo "كلمة المرور: ";
$password = trim(fgets(STDIN));

echo "الدور (Super Admin / Tenant): ";
$role = trim(fgets(STDIN));

// التحقق من البيانات
if (empty($name) || empty($email) || empty($password) || empty($role)) {
    echo "❌ خطأ: جميع الحقول مطلوبة!\n";
    exit(1);
}

if (!in_array($role, ['Super Admin', 'Tenant'])) {
    echo "❌ خطأ: الدور يجب أن يكون 'Super Admin' أو 'Tenant'!\n";
    exit(1);
}

// التحقق من وجود المستخدم
if (User::where('email', $email)->exists()) {
    echo "❌ خطأ: المستخدم موجود بالفعل!\n";
    exit(1);
}

// إنشاء المستخدم
try {
    $user = User::create([
        'name' => $name,
        'email' => $email,
        'password' => Hash::make($password),
        'email_verified_at' => now(),
    ]);

    $user->assignRole($role);

    echo "\n✅ تم إنشاء المستخدم بنجاح!\n";
    echo "   الاسم: {$user->name}\n";
    echo "   البريد: {$user->email}\n";
    echo "   الدور: {$role}\n";
    echo "\n";
} catch (\Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    exit(1);
}

