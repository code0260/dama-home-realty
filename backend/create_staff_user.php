<?php

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$staffEmail = 'staff@dama-home.com';
$staffPassword = 'staff123';

$staff = User::firstOrCreate(
    ['email' => $staffEmail],
    [
        'name' => 'Staff Manager',
        'password' => Hash::make($staffPassword),
        'email_verified_at' => now(),
    ]
);

if (!$staff->hasRole('Staff')) {
    $staff->assignRole('Staff');
    echo "✅ Staff role assigned to user: {$staff->email}" . PHP_EOL;
} else {
    echo "✅ Staff user already has Staff role: {$staff->email}" . PHP_EOL;
}

echo PHP_EOL . "📋 Staff Login Credentials:" . PHP_EOL;
echo "   Email: {$staffEmail}" . PHP_EOL;
echo "   Password: {$staffPassword}" . PHP_EOL;
echo PHP_EOL . "✅ Done!" . PHP_EOL;

