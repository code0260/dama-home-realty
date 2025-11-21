<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder لإضافة إيميلات Admins جديدة
 * 
 * الاستخدام:
 * php artisan db:seed --class=AddAdminEmailsSeeder
 */
class AddAdminEmailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // قائمة Admins المراد إضافتها
        $admins = [
            [
                'name' => 'Manager 1',
                'email' => 'manager1@dama-home.com',
                'password' => Hash::make('manager123'), // غيّر كلمة المرور!
            ],
            [
                'name' => 'Manager 2',
                'email' => 'manager2@dama-home.com',
                'password' => Hash::make('manager123'), // غيّر كلمة المرور!
            ],
            [
                'name' => 'Support Team',
                'email' => 'support@dama-home.com',
                'password' => Hash::make('support123'), // غيّر كلمة المرور!
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
                $this->command->info("✅ Admin created/updated: {$adminData['email']}");
            } else {
                $this->command->info("ℹ️  Admin already exists: {$adminData['email']}");
            }
        }

        $this->command->info("\n✅ All admins processed!");
    }
}

