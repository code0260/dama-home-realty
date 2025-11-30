<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create 
                            {--name= : اسم المستخدم}
                            {--email= : البريد الإلكتروني}
                            {--password= : كلمة المرور}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'إنشاء حساب admin جديد';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== إنشاء حساب Admin جديد ===');
        $this->newLine();

        // الحصول على البيانات
        $name = $this->option('name') ?: $this->ask('الاسم');
        $email = $this->option('email') ?: $this->ask('البريد الإلكتروني');
        $password = $this->option('password') ?: $this->secret('كلمة المرور');

        // التحقق من البيانات
        if (empty($name) || empty($email) || empty($password)) {
            $this->error('❌ جميع الحقول مطلوبة!');
            return 1;
        }

        // التحقق من صحة البريد الإلكتروني
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('❌ البريد الإلكتروني غير صحيح!');
            return 1;
        }

        // التحقق من وجود المستخدم
        if (User::where('email', $email)->exists()) {
            $this->error('❌ المستخدم موجود بالفعل!');
            return 1;
        }

        // التأكد من وجود دور Super Admin
        $role = Role::firstOrCreate(['name' => 'Super Admin']);

        // إنشاء المستخدم
        try {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]);

            $user->assignRole($role);

            $this->newLine();
            $this->info('✅ تم إنشاء المستخدم بنجاح!');
            $this->table(
                ['المعلومة', 'القيمة'],
                [
                    ['الاسم', $user->name],
                    ['البريد الإلكتروني', $user->email],
                    ['الدور', 'Super Admin'],
                ]
            );
            $this->newLine();
            $this->info('🌐 يمكنك تسجيل الدخول من: https://damahomerealty.com/admin/login');
            
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ خطأ: ' . $e->getMessage());
            return 1;
        }
    }
}

