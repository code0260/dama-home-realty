<?php

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

echo "=== ROLES ===" . PHP_EOL;
$roles = Role::all();
foreach ($roles as $role) {
    echo "Role: {$role->name}" . PHP_EOL;
    $permissions = $role->permissions->pluck('name')->toArray();
    if (empty($permissions)) {
        echo "  No permissions assigned" . PHP_EOL;
    } else {
        echo "  Permissions (" . count($permissions) . "):" . PHP_EOL;
        foreach ($permissions as $perm) {
            echo "    - {$perm}" . PHP_EOL;
        }
    }
    echo PHP_EOL;
}

echo "=== ALL PERMISSIONS ===" . PHP_EOL;
$allPermissions = Permission::all()->pluck('name')->toArray();
foreach ($allPermissions as $perm) {
    echo "  - {$perm}" . PHP_EOL;
}

echo PHP_EOL . "✅ Done!" . PHP_EOL;

