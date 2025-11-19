<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Roles and Permissions first
        $this->call(RolePermissionSeeder::class);

        // Create Admin User
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@dama-home.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('Super Admin');

        // Create Neighborhoods first (required for properties)
        $neighborhoods = Neighborhood::factory(14)->create();

        // Create 10 Properties linked to neighborhoods
        Property::factory(10)->create();

        // Create some Leads
        Lead::factory(15)->create();
    }
}
