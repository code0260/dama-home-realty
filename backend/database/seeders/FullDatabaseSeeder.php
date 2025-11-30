<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Article;
use App\Models\Booking;
use App\Models\Lead;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

class FullDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 بدء ملء قاعدة البيانات...');
        $this->command->newLine();

        // 1. Seed Roles and Permissions
        $this->command->info('1️⃣ إنشاء الأدوار والصلاحيات...');
        $this->call(RolePermissionSeeder::class);
        $this->command->info('   ✅ تم إنشاء الأدوار والصلاحيات');
        $this->command->newLine();

        // 2. Create Admin User
        $this->command->info('2️⃣ إنشاء حساب Admin...');
        $admin = User::firstOrCreate(
            ['email' => 'admin@dama.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]
        );
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        if (!$admin->hasRole('Super Admin')) {
            $admin->assignRole('Super Admin');
        }
        $this->command->info('   ✅ Admin: admin@dama.com / 123456789');
        $this->command->newLine();

        // 3. Create Neighborhoods (أحياء دمشق)
        $this->command->info('3️⃣ إنشاء الأحياء...');
        $neighborhoodsData = [
            ['name' => ['en' => 'Abu Rummaneh', 'ar' => 'أبو رمانة']],
            ['name' => ['en' => 'Malki', 'ar' => 'المالكي']],
            ['name' => ['en' => 'Mazzeh', 'ar' => 'المزة']],
            ['name' => ['en' => 'Shaalan', 'ar' => 'الشعلان']],
            ['name' => ['en' => 'Kafr Sousa', 'ar' => 'كفر سوسة']],
            ['name' => ['en' => 'Bab Touma', 'ar' => 'باب توما']],
            ['name' => ['en' => 'Rukn Al-Din', 'ar' => 'ركن الدين']],
            ['name' => ['en' => 'Dummar', 'ar' => 'دمر']],
            ['name' => ['en' => 'Barzeh', 'ar' => 'برزة']],
            ['name' => ['en' => 'Mezzeh 86', 'ar' => 'مزة 86']],
            ['name' => ['en' => 'Al-Salihiyah', 'ar' => 'الصالحية']],
            ['name' => ['en' => 'Al-Qanawat', 'ar' => 'القنوات']],
            ['name' => ['en' => 'Al-Midan', 'ar' => 'الميدان']],
            ['name' => ['en' => 'Al-Qadam', 'ar' => 'القدم']],
        ];

        $neighborhoods = [];
        foreach ($neighborhoodsData as $data) {
            $neighborhood = Neighborhood::firstOrCreate(
                ['name' => $data['name']],
                $data
            );
            $neighborhoods[] = $neighborhood;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($neighborhoods) . ' حي');
        $this->command->newLine();

        // 4. Create Agents
        $this->command->info('4️⃣ إنشاء الوكلاء...');
        $agentsData = [
            [
                'name' => 'أحمد الخطيب',
                'role' => 'Real Estate Agent',
                'phone' => '+963 11 234 5678',
                'languages' => ['English', 'Arabic'],
                'license_no' => 'LIC-000001',
            ],
            [
                'name' => 'فاطمة الأسد',
                'role' => 'Senior Real Estate Consultant',
                'phone' => '+963 11 345 6789',
                'languages' => ['English', 'Arabic', 'French'],
                'license_no' => 'LIC-000002',
            ],
            [
                'name' => 'محمد الحموي',
                'role' => 'Property Manager',
                'phone' => '+963 11 456 7890',
                'languages' => ['English', 'Arabic'],
                'license_no' => 'LIC-000003',
            ],
            [
                'name' => 'سارة الديري',
                'role' => 'Real Estate Agent',
                'phone' => '+963 11 567 8901',
                'languages' => ['English', 'Arabic'],
                'license_no' => 'LIC-000004',
            ],
        ];

        $agents = [];
        foreach ($agentsData as $data) {
            $agent = Agent::firstOrCreate(
                ['license_no' => $data['license_no']],
                array_merge($data, [
                    'is_active' => true,
                    'photo' => null,
                ])
            );
            $agents[] = $agent;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($agents) . ' وكيل');
        $this->command->newLine();

        // 5. Create Properties
        $this->command->info('5️⃣ إنشاء العقارات...');
        $propertiesData = [
            [
                'title' => ['en' => 'Luxury Apartment in Abu Rummaneh', 'ar' => 'شقة فاخرة في أبو رمانة'],
                'description' => [
                    'en' => 'Beautiful modern apartment with stunning views, fully furnished, 24/7 electricity, WiFi, and all amenities.',
                    'ar' => 'شقة حديثة جميلة بإطلالة رائعة، مفروشة بالكامل، كهرباء 24/7، واي فاي، وجميع المرافق.'
                ],
                'price' => 500,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area_sqm' => 150,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Air Conditioning', 'Furnished', 'Elevator'],
            ],
            [
                'title' => ['en' => 'Elegant Penthouse in Malki', 'ar' => 'بنتهاوس أنيق في المالكي'],
                'description' => [
                    'en' => 'Spacious penthouse with panoramic city views, premium finishes, and luxury amenities.',
                    'ar' => 'بنتهاوس واسع بإطلالة بانورامية على المدينة، تشطيبات فاخرة، ومرافق راقية.'
                ],
                'price' => 800,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area_sqm' => 250,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Garden', 'Balcony', 'Elevator', 'Security', 'Furnished'],
            ],
            [
                'title' => ['en' => 'Modern Studio in Bab Touma', 'ar' => 'استوديو حديث في باب توما'],
                'description' => [
                    'en' => 'Cozy studio apartment in the heart of Old Damascus, perfect for singles or couples.',
                    'ar' => 'استوديو مريح في قلب دمشق القديمة، مثالي للأفراد أو الأزواج.'
                ],
                'price' => 250,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area_sqm' => 45,
                'is_verified' => true,
                'is_featured' => false,
                'amenities' => ['WiFi', 'Solar Power', 'Air Conditioning', 'Furnished'],
            ],
            [
                'title' => ['en' => 'Family House in Mazzeh', 'ar' => 'منزل عائلي في المزة'],
                'description' => [
                    'en' => 'Large family house with garden, perfect for families looking for a comfortable home.',
                    'ar' => 'منزل عائلي كبير مع حديقة، مثالي للعائلات الباحثة عن منزل مريح.'
                ],
                'price' => 600,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 5,
                'bathrooms' => 4,
                'area_sqm' => 300,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Garden', 'Security', 'Furnished', 'Water Tank'],
            ],
            [
                'title' => ['en' => 'Boutique Hotel Suite in Shaalan', 'ar' => 'جناح فندق بوتيك في الشعلان'],
                'description' => [
                    'en' => 'Luxury hotel suite with daily housekeeping, perfect for short or long stays.',
                    'ar' => 'جناح فندق فاخر مع خدمة تنظيف يومية، مثالي للإقامات القصيرة أو الطويلة.'
                ],
                'price' => 100,
                'currency' => 'USD',
                'type' => 'hotel',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area_sqm' => 80,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Air Conditioning', 'Furnished', 'Daily Cleaning'],
            ],
            [
                'title' => ['en' => 'Apartment for Sale in Kafr Sousa', 'ar' => 'شقة للبيع في كفر سوسة'],
                'description' => [
                    'en' => 'Well-maintained apartment in excellent location, ready to move in immediately.',
                    'ar' => 'شقة محافظة جيداً في موقع ممتاز، جاهزة للسكن الفوري.'
                ],
                'price' => 120000,
                'currency' => 'USD',
                'type' => 'sale',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area_sqm' => 140,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Elevator', 'Security'],
            ],
            [
                'title' => ['en' => 'Cozy Apartment in Rukn Al-Din', 'ar' => 'شقة مريحة في ركن الدين'],
                'description' => [
                    'en' => 'Charming apartment with traditional architecture, modern amenities, and great location.',
                    'ar' => 'شقة ساحرة بعمارة تقليدية، مرافق حديثة، وموقع رائع.'
                ],
                'price' => 350,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area_sqm' => 90,
                'is_verified' => true,
                'is_featured' => false,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Air Conditioning', 'Furnished'],
            ],
            [
                'title' => ['en' => 'Luxury Villa for Sale in Dummar', 'ar' => 'فيلا فاخرة للبيع في دمر'],
                'description' => [
                    'en' => 'Stunning luxury villa with private pool, garden, and premium finishes throughout.',
                    'ar' => 'فيلا فاخرة رائعة مع مسبح خاص، حديقة، وتشطيبات فاخرة في جميع أنحاء المنزل.'
                ],
                'price' => 350000,
                'currency' => 'USD',
                'type' => 'sale',
                'bedrooms' => 6,
                'bathrooms' => 5,
                'area_sqm' => 450,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Garden', 'Pool', 'Security', 'Generator', 'Water Tank'],
            ],
            [
                'title' => ['en' => 'Spacious Apartment in Barzeh', 'ar' => 'شقة واسعة في برزة'],
                'description' => [
                    'en' => 'Modern spacious apartment with great natural light, perfect for families.',
                    'ar' => 'شقة حديثة واسعة بإضاءة طبيعية رائعة، مثالية للعائلات.'
                ],
                'price' => 400,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area_sqm' => 120,
                'is_verified' => true,
                'is_featured' => true,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Air Conditioning', 'Furnished'],
            ],
            [
                'title' => ['en' => 'Charming House in Al-Salihiyah', 'ar' => 'منزل ساحر في الصالحية'],
                'description' => [
                    'en' => 'Beautiful traditional house with modern updates, located in historic area.',
                    'ar' => 'منزل تقليدي جميل مع تحديثات حديثة، يقع في منطقة تاريخية.'
                ],
                'price' => 450,
                'currency' => 'USD',
                'type' => 'rent',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area_sqm' => 200,
                'is_verified' => true,
                'is_featured' => false,
                'amenities' => ['WiFi', 'Solar Power', 'Parking', 'Garden', 'Furnished'],
            ],
        ];

        $properties = [];
        foreach ($propertiesData as $data) {
            $neighborhood = $neighborhoods[array_rand($neighborhoods)];
            $agent = $agents[array_rand($agents)];
            
            $property = Property::firstOrCreate(
                ['slug' => Str::slug($data['title']['en'])],
                array_merge($data, [
                    'uuid' => Str::uuid(),
                    'neighborhood_id' => $neighborhood->id,
                    'agent_id' => $agent->id,
                    'owner_contact' => '+963 11 ' . rand(100, 999) . ' ' . rand(1000, 9999),
                    'images' => [],
                    'status' => 'active',
                    'reference_id' => 'REF-' . str_pad((string) (Property::max('id') ?? 0) + 1, 4, '0', STR_PAD_LEFT),
                ])
            );
            $properties[] = $property;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($properties) . ' عقار');
        $this->command->newLine();

        // 6. Create Test Users (Tenants)
        $this->command->info('6️⃣ إنشاء مستخدمين (مستأجرين)...');
        $users = [];
        $userNames = ['أحمد محمد', 'فاطمة علي', 'محمد خالد', 'سارة أحمد', 'خالد حسن'];
        foreach ($userNames as $name) {
            $user = User::firstOrCreate(
                ['email' => Str::slug($name) . '@example.com'],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $users[] = $user;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($users) . ' مستخدم');
        $this->command->newLine();

        // 7. Create Bookings
        $this->command->info('7️⃣ إنشاء الحجوزات...');
        $bookings = [];
        for ($i = 0; $i < 8; $i++) {
            $property = $properties[array_rand($properties)];
            $user = $users[array_rand($users)];
            
            $checkIn = Carbon::now()->addDays(rand(1, 30));
            $checkOut = $checkIn->copy()->addDays(rand(3, 14));
            $days = $checkIn->diffInDays($checkOut);
            $totalPrice = $property->price * $days;
            
            $booking = Booking::create([
                'property_id' => $property->id,
                'user_id' => $user->id,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'total_price' => $totalPrice,
                'amount_paid' => $totalPrice * 0.5, // 50% paid
                'payment_status' => ['pending', 'partial', 'paid'][array_rand(['pending', 'partial', 'paid'])],
                'booking_status' => ['pending', 'confirmed', 'completed', 'cancelled'][array_rand(['pending', 'confirmed', 'completed', 'cancelled'])],
                'notes' => 'Booking created via seeder',
            ]);
            $bookings[] = $booking;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($bookings) . ' حجز');
        $this->command->newLine();

        // 8. Create Leads
        $this->command->info('8️⃣ إنشاء العملاء المحتملين...');
        $leads = [];
        $leadNames = ['علي محمود', 'ليلى أحمد', 'حسن خالد', 'نورا محمد', 'ياسر علي', 'ريم خالد', 'باسم أحمد', 'هند محمد'];
        foreach ($leadNames as $name) {
            $property = $properties[array_rand($properties)];
            $lead = Lead::create([
                'name' => $name,
                'phone' => '+963 11 ' . rand(100, 999) . ' ' . rand(1000, 9999),
                'message' => 'أريد معلومات عن هذا العقار',
                'property_id' => $property->id,
                'status' => ['new', 'contacted', 'qualified', 'converted', 'lost'][array_rand(['new', 'contacted', 'qualified', 'converted', 'lost'])],
                'type' => ['inquiry', 'viewing', 'booking'][array_rand(['inquiry', 'viewing', 'booking'])],
                'preferred_date' => Carbon::now()->addDays(rand(1, 14)),
                'preferred_time' => ['09:00', '14:00', '16:00'][array_rand(['09:00', '14:00', '16:00'])],
            ]);
            $leads[] = $lead;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($leads) . ' عميل محتمل');
        $this->command->newLine();

        // 9. Create Testimonials
        $this->command->info('9️⃣ إنشاء الشهادات...');
        $testimonialsData = [
            [
                'name' => 'أحمد الخالدي',
                'role' => 'مستأجر',
                'content' => 'خدمة ممتازة وعقارات موثوقة. أنصح الجميع بالتعامل معهم.',
                'rating' => 5,
            ],
            [
                'name' => 'فاطمة الأسد',
                'role' => 'مستثمرة',
                'content' => 'وجدت العقار المثالي بفضل فريق العمل المحترف.',
                'rating' => 5,
            ],
            [
                'name' => 'محمد الحموي',
                'role' => 'مستأجر',
                'content' => 'تجربة رائعة من البداية للنهاية. شكراً لكم!',
                'rating' => 5,
            ],
            [
                'name' => 'سارة الديري',
                'role' => 'مستثمرة',
                'content' => 'عقارات عالية الجودة وخدمة عملاء ممتازة.',
                'rating' => 5,
            ],
            [
                'name' => 'خالد حسن',
                'role' => 'مستأجر',
                'content' => 'أفضل موقع للبحث عن عقارات في دمشق.',
                'rating' => 5,
            ],
        ];

        $testimonials = [];
        foreach ($testimonialsData as $data) {
            $testimonial = Testimonial::firstOrCreate(
                ['name' => $data['name']],
                array_merge($data, [
                    'is_featured' => true,
                    'is_approved' => true,
                ])
            );
            $testimonials[] = $testimonial;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($testimonials) . ' شهادة');
        $this->command->newLine();

        // 10. Create Services
        $this->command->info('🔟 إنشاء الخدمات...');
        $servicesData = [
            [
                'name' => ['en' => 'Property Management', 'ar' => 'إدارة العقارات'],
                'description' => [
                    'en' => 'Complete property management services including maintenance, tenant relations, and financial management.',
                    'ar' => 'خدمات إدارة عقارات شاملة تشمل الصيانة، علاقات المستأجرين، والإدارة المالية.'
                ],
                'price' => 100,
                'currency' => 'USD',
            ],
            [
                'name' => ['en' => 'Real Estate Consultation', 'ar' => 'استشارات عقارية'],
                'description' => [
                    'en' => 'Expert consultation for buying, selling, or renting properties in Damascus.',
                    'ar' => 'استشارات خبيرة لشراء أو بيع أو تأجير العقارات في دمشق.'
                ],
                'price' => 50,
                'currency' => 'USD',
            ],
            [
                'name' => ['en' => 'Property Valuation', 'ar' => 'تقييم العقارات'],
                'description' => [
                    'en' => 'Professional property valuation services to determine fair market value.',
                    'ar' => 'خدمات تقييم عقارية احترافية لتحديد القيمة السوقية العادلة.'
                ],
                'price' => 75,
                'currency' => 'USD',
            ],
            [
                'name' => ['en' => 'Legal Documentation', 'ar' => 'الوثائق القانونية'],
                'description' => [
                    'en' => 'Assistance with all legal documentation and contracts for property transactions.',
                    'ar' => 'المساعدة في جميع الوثائق القانونية والعقود لمعاملات العقارات.'
                ],
                'price' => 150,
                'currency' => 'USD',
            ],
        ];

        $services = [];
        foreach ($servicesData as $data) {
            $service = Service::firstOrCreate(
                ['name' => $data['name']],
                array_merge($data, [
                    'is_active' => true,
                ])
            );
            $services[] = $service;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($services) . ' خدمة');
        $this->command->newLine();

        // 11. Create Blog Articles
        $this->command->info('1️⃣1️⃣ إنشاء المقالات...');
        $articlesData = [
            [
                'title' => ['en' => 'Best Neighborhoods to Live in Damascus', 'ar' => 'أفضل الأحياء للسكن في دمشق'],
                'slug' => 'best-neighborhoods-damascus',
                'excerpt' => [
                    'en' => 'A comprehensive guide to the best neighborhoods in Damascus for expats and locals.',
                    'ar' => 'دليل شامل لأفضل الأحياء في دمشق للمغتربين والمحليين.'
                ],
                'content' => [
                    'en' => 'Damascus offers a variety of neighborhoods, each with its unique charm...',
                    'ar' => 'تقدم دمشق مجموعة متنوعة من الأحياء، كل منها له سحره الفريد...'
                ],
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => ['en' => 'Tips for Renting in Damascus', 'ar' => 'نصائح لتأجير العقارات في دمشق'],
                'slug' => 'tips-renting-damascus',
                'excerpt' => [
                    'en' => 'Essential tips and advice for finding and renting the perfect property in Damascus.',
                    'ar' => 'نصائح وإرشادات أساسية لإيجاد وتأجير العقار المثالي في دمشق.'
                ],
                'content' => [
                    'en' => 'Renting a property in Damascus requires careful consideration...',
                    'ar' => 'تأجير عقار في دمشق يتطلب اعتبارات دقيقة...'
                ],
                'is_published' => true,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => ['en' => 'Understanding Property Prices in Syria', 'ar' => 'فهم أسعار العقارات في سوريا'],
                'slug' => 'property-prices-syria',
                'excerpt' => [
                    'en' => 'A detailed analysis of property prices and market trends in Syria.',
                    'ar' => 'تحليل مفصل لأسعار العقارات واتجاهات السوق في سوريا.'
                ],
                'content' => [
                    'en' => 'The Syrian real estate market has seen various changes...',
                    'ar' => 'شهد سوق العقارات السوري تغييرات متنوعة...'
                ],
                'is_published' => true,
                'published_at' => now()->subDays(10),
            ],
        ];

        $articles = [];
        foreach ($articlesData as $data) {
            $article = Article::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
            $articles[] = $article;
        }
        $this->command->info('   ✅ تم إنشاء ' . count($articles) . ' مقال');
        $this->command->newLine();

        // Summary
        $this->command->newLine();
        $this->command->info('==========================================');
        $this->command->info('✅ تم ملء قاعدة البيانات بنجاح!');
        $this->command->info('==========================================');
        $this->command->newLine();
        $this->command->table(
            ['النوع', 'العدد'],
            [
                ['الأحياء', Neighborhood::count()],
                ['العقارات', Property::count()],
                ['الوكلاء', Agent::count()],
                ['المستخدمين', User::count()],
                ['الحجوزات', Booking::count()],
                ['العملاء المحتملين', Lead::count()],
                ['الشهادات', Testimonial::count()],
                ['الخدمات', Service::count()],
                ['المقالات', Article::count()],
            ]
        );
        $this->command->newLine();
        $this->command->info('🌐 يمكنك الآن زيارة لوحة التحكم: https://damahomerealty.com/admin');
        $this->command->newLine();
    }
}

