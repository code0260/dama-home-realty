# Staff Role Implementation Guide

## Overview
This document describes the implementation of the **Staff (Manager)** role, which sits between Super Admin and Tenant in the permission hierarchy.

## Role Hierarchy

1. **Super Admin**: Full access to everything
2. **Staff (Manager)**: Limited access - can manage content but cannot delete or access system settings
3. **Tenant**: Very limited access - can only view and create bookings

## Staff Permissions

### ✅ Allowed Actions

#### Properties
- ✅ View properties
- ✅ Create properties
- ✅ Update properties
- ❌ Delete properties (Super Admin only)

#### Bookings
- ✅ View bookings
- ✅ Update bookings
- ❌ Delete bookings (Super Admin only)

#### Leads
- ✅ View leads
- ✅ Update leads
- ❌ Delete leads (Super Admin only)

#### Agents
- ✅ View agents
- ✅ Create agents
- ✅ Update agents
- ❌ Delete agents (Super Admin only)

#### Services
- ✅ View services
- ✅ Create services
- ✅ Update services
- ❌ Delete services (Super Admin only)

### ❌ Forbidden Access

Staff **cannot** access:
- ❌ User Management (UserResource)
- ❌ Role Management (RoleResource)
- ❌ Database Backup (BackupPage)
- ❌ Activity Log (ActivityLogResource)

## Implementation Details

### 1. Seeder (`RolePermissionSeeder.php`)
- Creates `Staff` role
- Assigns appropriate permissions to Staff
- Permissions are granular (view, create, edit, delete)

### 2. Policies
All models now have policies that enforce role-based access:

- `PropertyPolicy`: Staff can view/create/update, but not delete
- `BookingPolicy`: Staff can view/update, but not delete
- `LeadPolicy`: Staff can view/update, but not delete
- `AgentPolicy`: Staff can view/create/update, but not delete
- `ServicePolicy`: Staff can view/create/update, but not delete
- `UserPolicy`: Only Super Admin can access
- `RolePolicy`: Only Super Admin can access

### 3. Filament UI Adjustments

#### Hidden Delete Buttons
- All `DeleteAction` buttons are hidden for Staff users
- All `DeleteBulkAction` buttons are hidden for Staff users
- Delete buttons only visible to Super Admin

#### Hidden Resources/Pages
- `BackupPage`: `canAccess()` returns false for Staff
- `ActivityLogResource`: `canAccess()` returns false for Staff
- User and Role resources (if created) will be hidden via policies

### 4. Panel Access
- Updated `User::canAccessPanel()` to allow both Super Admin and Staff
- Staff can now log into the Admin Panel

## Usage

### Creating a Staff User

```php
// Via Seeder
$staff = User::create([
    'name' => 'Staff Member',
    'email' => 'staff@dama-home.com',
    'password' => Hash::make('password'),
]);
$staff->assignRole('Staff');

// Via Tinker
php artisan tinker
$user = User::create([...]);
$user->assignRole('Staff');
```

### Running the Seeder

```bash
php artisan db:seed --class=RolePermissionSeeder
```

## Testing

1. Create a Staff user
2. Log in as Staff
3. Verify:
   - ✅ Can access Properties, Bookings, Leads, Agents, Services
   - ✅ Can create/edit but NOT delete
   - ❌ Cannot see Backup, Activity Log, User Management
   - ❌ Delete buttons are hidden

## Files Modified

### Seeders
- `backend/database/seeders/RolePermissionSeeder.php`

### Policies
- `backend/app/Policies/PropertyPolicy.php` (new)
- `backend/app/Policies/LeadPolicy.php` (new)
- `backend/app/Policies/AgentPolicy.php` (new)
- `backend/app/Policies/ServicePolicy.php` (new)
- `backend/app/Policies/UserPolicy.php` (new)
- `backend/app/Policies/RolePolicy.php` (new)
- `backend/app/Policies/BookingPolicy.php` (updated)

### Resources
- `backend/app/Filament/Resources/PropertyResource.php`
- `backend/app/Filament/Resources/PropertyResource/Pages/EditProperty.php`
- `backend/app/Filament/Resources/LeadResource.php`
- `backend/app/Filament/Resources/LeadResource/Pages/EditLead.php`
- `backend/app/Filament/Resources/BookingResource.php`
- `backend/app/Filament/Resources/BookingResource/Pages/EditBooking.php`
- `backend/app/Filament/Resources/AgentResource.php`
- `backend/app/Filament/Resources/AgentResource/Pages/EditAgent.php`
- `backend/app/Filament/Resources/ServiceResource.php`
- `backend/app/Filament/Resources/ServiceResource/Pages/EditService.php`
- `backend/app/Filament/Resources/ActivityLogResource.php`

### Pages
- `backend/app/Filament/Pages/BackupPage.php`

### Models
- `backend/app/Models/User.php`

### Providers
- `backend/app/Providers/AppServiceProvider.php`

## Security Notes

- All policies are enforced at the application level
- UI elements are hidden, but backend policies provide the real security
- Staff users cannot escalate their privileges
- All delete operations require Super Admin role

