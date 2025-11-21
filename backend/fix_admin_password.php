<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Find admin user
$admin = User::where('email', 'admin@dama-home.com')->first();

if (!$admin) {
    echo "❌ Admin user not found! Creating new admin...\n";
    
    $admin = User::create([
        'name' => 'Super Admin',
        'email' => 'admin@dama-home.com',
        'password' => Hash::make('admin123'),
        'email_verified_at' => now(),
    ]);
    
    // Assign Super Admin role
    $superAdminRole = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'Super Admin']);
    $admin->assignRole('Super Admin');
    
    echo "✅ Admin user created successfully!\n";
} else {
    echo "✅ Admin user found: {$admin->email}\n";
    echo "   Name: {$admin->name}\n";
    echo "   Roles: " . $admin->getRoleNames()->implode(', ') . "\n";
    
    // Reset password to ensure it's correct
    $admin->password = Hash::make('admin123');
    $admin->save();
    
    echo "✅ Password reset to: admin123\n";
}

echo "\n📋 Login Credentials:\n";
echo "   Email: admin@dama-home.com\n";
echo "   Password: admin123\n";
echo "\n✅ Done!\n";

