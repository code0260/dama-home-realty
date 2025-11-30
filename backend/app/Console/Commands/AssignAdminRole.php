<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class AssignAdminRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:assign-role {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'إعطاء دور Super Admin لمستخدم موجود';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("❌ المستخدم غير موجود: {$email}");
            return 1;
        }

        $role = Role::firstOrCreate(['name' => 'Super Admin']);
        $user->assignRole($role);

        $this->info("✅ تم إعطاء دور Super Admin للمستخدم: {$user->name} ({$user->email})");
        
        return 0;
    }
}

