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
            // Bookings
            'view bookings',
            'create bookings',
            'edit bookings',
            'delete bookings',
            
            // Properties
            'view properties',
            'create properties',
            'edit properties',
            'delete properties',
            
            // Leads
            'view leads',
            'edit leads',
            'delete leads',
            
            // Agents
            'view agents',
            'create agents',
            'edit agents',
            'delete agents',
            
            // Services
            'view services',
            'create services',
            'edit services',
            'delete services',
            
            // Admin only
            'manage users',
            'manage roles',
            'manage backups',
            'view activity log',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $staff = Role::firstOrCreate(['name' => 'Staff']);
        $tenant = Role::firstOrCreate(['name' => 'Tenant']);

        // Assign all permissions to Super Admin
        $superAdmin->givePermissionTo(Permission::all());

        // Assign permissions to Staff
        $staff->givePermissionTo([
            // Properties: view, create, update (NO delete)
            'view properties',
            'create properties',
            'edit properties',
            
            // Bookings: view, update (NO delete)
            'view bookings',
            'edit bookings',
            
            // Leads: view, update
            'view leads',
            'edit leads',
            
            // Agents: view, create, update
            'view agents',
            'create agents',
            'edit agents',
            
            // Services: view, create, update
            'view services',
            'create services',
            'edit services',
        ]);

        // Assign limited permissions to Tenant
        $tenant->givePermissionTo(['view bookings', 'create bookings']);

        // Assign Super Admin role to existing admin user
        $admin = User::where('email', 'admin@dama-home.com')->first();
        if ($admin) {
            $admin->assignRole('Super Admin');
        }
    }
}
