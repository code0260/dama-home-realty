<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder لإضافة إيميلات Tenants (عملاء) جديدة
 * 
 * الاستخدام:
 * php artisan db:seed --class=AddTenantEmailsSeeder
 */
class AddTenantEmailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // قائمة Tenants المراد إضافتها
        $tenants = [
            [
                'name' => 'Customer 1',
                'email' => 'customer1@example.com',
                'password' => Hash::make('password123'), // غيّر كلمة المرور!
            ],
            [
                'name' => 'Customer 2',
                'email' => 'customer2@example.com',
                'password' => Hash::make('password123'), // غيّر كلمة المرور!
            ],
            [
                'name' => 'Customer 3',
                'email' => 'customer3@example.com',
                'password' => Hash::make('password123'), // غيّر كلمة المرور!
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
                $this->command->info("✅ Tenant created/updated: {$tenantData['email']}");
            } else {
                $this->command->info("ℹ️  Tenant already exists: {$tenantData['email']}");
            }
        }

        $this->command->info("\n✅ All tenants processed!");
    }
}

