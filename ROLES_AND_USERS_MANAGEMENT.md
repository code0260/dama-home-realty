# Roles & Users Management System

## Overview
Complete UI for managing Roles and Users dynamically in the Filament Admin Panel. Only Super Admin can access these resources.

## Features

### 1. RoleResource (`/admin/roles`)

#### ✅ Create New Roles
- **Name Input**: Enter unique role name (e.g., "Sales Agent", "Manager")
- **Permissions Checkbox List**: 
  - Shows ALL available permissions in the system
  - Searchable checkbox list
  - Bulk toggleable
  - 2 columns layout
  - Descriptions for each permission
  - Required field

#### ✅ Table View
- **Role Name**: Badge with color coding
  - Super Admin: Red (danger)
  - Staff: Yellow (warning)
  - Tenant: Blue (info)
  - Others: Gray
- **Users Count**: Number of users with this role
- **Permissions Count**: Number of permissions assigned
- **Permission List**: Expandable list of all permissions (hidden by default)

#### ✅ Protection
- Only Super Admin can access
- Cannot delete default roles (Super Admin, Staff, Tenant)

### 2. UserResource (`/admin/users`)

#### ✅ Create/Edit Users
- **User Information Section**:
  - Full Name (required)
  - Email Address (required, unique)
  - Password (required on create, optional on edit)
  - Email Verified At (defaults to now)

- **Role Assignment Section**:
  - Single Role Select dropdown
  - Shows all available roles
  - Searchable
  - Required field
  - Helper text explaining role assignment

#### ✅ Table View
- **Name**: Bold, searchable
- **Email**: Searchable, copyable, with envelope icon
- **Role**: Badge with color coding (same as RoleResource)
- **Email Verified**: Boolean icon
- **Bookings Count**: Number of bookings (toggleable)
- **Created Date**: Toggleable

#### ✅ Filters
- Filter by Role (multiple select)
- Filter by Email Verified status

#### ✅ Protection
- Only Super Admin can access
- Cannot delete Super Admin users
- Delete button hidden for Super Admin users

## Usage Guide

### Creating a New Role

1. Go to **System → Roles & Permissions**
2. Click **"Create Role"**
3. Enter role name (e.g., "Sales Agent")
4. Select permissions using checkboxes:
   - Use search to find specific permissions
   - Use "Select All" / "Deselect All" for bulk operations
   - Each permission has a description
5. Click **"Create"**

### Creating a New User

1. Go to **System → Users**
2. Click **"Create User"**
3. Fill in:
   - Full Name
   - Email Address
   - Password
   - Email Verified At (optional, defaults to now)
4. Select a **Role** from dropdown
5. Click **"Create"**

### Editing a Role

1. Go to **System → Roles & Permissions**
2. Click on a role or click **"Edit"**
3. Modify role name (if needed)
4. Add/remove permissions using checkboxes
5. Click **"Save"**

### Editing a User

1. Go to **System → Users**
2. Click on a user or click **"Edit"**
3. Modify user information
4. Change role assignment
5. Leave password empty to keep current password
6. Click **"Save"**

## Permission Descriptions

The system automatically generates descriptions for permissions:
- **view**: "View and browse records for [resource]"
- **create**: "Create new records for [resource]"
- **edit**: "Modify existing records for [resource]"
- **delete**: "Remove records for [resource] (Super Admin only)"
- **manage**: "Full management access for [resource]"

## Security Features

### Access Control
- ✅ `RoleResource::canAccess()` - Only Super Admin
- ✅ `UserResource::canAccess()` - Only Super Admin
- ✅ Protected via `UserPolicy` and `RolePolicy`

### Delete Protection
- ✅ Cannot delete default roles (Super Admin, Staff, Tenant)
- ✅ Cannot delete Super Admin users
- ✅ Delete buttons hidden for protected records

### UI Restrictions
- ✅ Resources hidden from Staff users
- ✅ Delete actions hidden for Staff
- ✅ Only Super Admin sees System group in sidebar

## Example: Creating "Sales Agent" Role

1. **Name**: Sales Agent
2. **Permissions**:
   - ✅ view properties
   - ✅ view bookings
   - ✅ view leads
   - ✅ edit leads
   - ✅ create bookings
   - ❌ delete (any resource)

This role can:
- View all properties and bookings
- View and update leads
- Create bookings
- Cannot delete anything

## Files Created/Modified

### Resources
- `backend/app/Filament/Resources/RoleResource.php` (created)
- `backend/app/Filament/Resources/RoleResource/Pages/CreateRole.php` (created)
- `backend/app/Filament/Resources/RoleResource/Pages/EditRole.php` (created)
- `backend/app/Filament/Resources/RoleResource/Pages/ListRoles.php` (created)
- `backend/app/Filament/Resources/UserResource.php` (created)
- `backend/app/Filament/Resources/UserResource/Pages/CreateUser.php` (created)
- `backend/app/Filament/Resources/UserResource/Pages/EditUser.php` (created)
- `backend/app/Filament/Resources/UserResource/Pages/ListUsers.php` (created)

### Policies
- `backend/app/Policies/UserPolicy.php` (already exists)
- `backend/app/Policies/RolePolicy.php` (already exists)

## Testing

1. **Login as Super Admin**
2. **Test Role Creation**:
   - Create "Sales Agent" role
   - Assign specific permissions
   - Verify it appears in table
3. **Test User Creation**:
   - Create user with "Sales Agent" role
   - Verify role is assigned correctly
4. **Test Editing**:
   - Edit role permissions
   - Edit user role assignment
5. **Test Protection**:
   - Try to delete Super Admin role → Should fail
   - Try to delete Super Admin user → Should fail

## Navigation

- **System → Roles & Permissions** (`/admin/roles`)
- **System → Users** (`/admin/users`)

Both resources are in the "System" navigation group and only visible to Super Admin.

