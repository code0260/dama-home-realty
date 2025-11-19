<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view bookings',
            'create bookings',
            'edit bookings',
            'delete bookings',
            'manage properties',
            'manage users',
            'manage tenants',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $tenant = Role::create(['name' => 'Tenant']);

        // Assign all permissions to Super Admin
        $superAdmin->givePermissionTo(Permission::all());

        // Assign limited permissions to Tenant
        $tenant->givePermissionTo(['view bookings', 'create bookings']);

        // Assign Super Admin role to existing admin user
        $admin = User::where('email', 'admin@dama-home.com')->first();
        if ($admin) {
            $admin->assignRole('Super Admin');
        }
    }
}
