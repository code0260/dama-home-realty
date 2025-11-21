<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class CreateAdminAndPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure roles exist
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);

        // Create or update Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@dama-home.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );
        
        if (!$admin->hasRole('Super Admin')) {
            $admin->assignRole('Super Admin');
        }

        $this->command->info('✅ Admin user created/updated:');
        $this->command->info('   Email: admin@dama-home.com');
        $this->command->info('   Password: admin123');

        // Ensure we have neighborhoods
        $neighborhoods = Neighborhood::all();
        if ($neighborhoods->isEmpty()) {
            $this->command->info('Creating neighborhoods...');
            $neighborhoods = Neighborhood::factory(14)->create();
        }

        // Create some agents if they don't exist
        if (Agent::count() < 3) {
            $this->command->info('Creating agents...');
            for ($i = 0; $i < 3; $i++) {
                Agent::create([
                    'name' => ['Ahmed Al-Khatib', 'Fatima Al-Assad', 'Mohammed Al-Hamwi'][$i],
                    'photo' => null,
                    'role' => ['Real Estate Agent', 'Senior Real Estate Consultant', 'Property Manager'][$i],
                    'phone' => ['+963 11 234 5678', '+963 11 345 6789', '+963 11 456 7890'][$i],
                    'languages' => ['English', 'Arabic'],
                    'license_no' => 'LIC-' . str_pad((string) ($i + 1), 6, '0', STR_PAD_LEFT),
                    'is_active' => true,
                ]);
            }
        }

        // Create properties (apartments)
        $this->command->info('Creating properties...');
        
        $propertyData = [
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
                'status' => 'active',
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
                'status' => 'active',
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
                'status' => 'active',
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
                'status' => 'active',
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
                'status' => 'active',
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
                'status' => 'active',
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
                'status' => 'active',
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
                'status' => 'active',
            ],
        ];

        $createdCount = 0;
        foreach ($propertyData as $data) {
            $neighborhood = Neighborhood::inRandomOrder()->first();
            
            $property = Property::firstOrCreate(
                [
                    'slug' => Str::slug($data['title']['en'])
                ],
                array_merge($data, [
                    'uuid' => Str::uuid(),
                    'neighborhood_id' => $neighborhood->id,
                    'agent_id' => Agent::inRandomOrder()->first()?->id,
                    'owner_contact' => '+963 11 123 4567',
                    'images' => [],
                    'reference_id' => 'REF-' . str_pad((string) (Property::max('id') ?? 0) + 1, 4, '0', STR_PAD_LEFT),
                ])
            );
            
            if ($property->wasRecentlyCreated) {
                $createdCount++;
            }
        }

        $this->command->info("✅ Created {$createdCount} new properties");
        $this->command->info("✅ Total properties in database: " . Property::count());
    }
}

