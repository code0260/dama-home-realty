<?php

namespace Database\Factories;

use App\Models\Neighborhood;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $damascusLocations = [
            'Abu Rummaneh',
            'Malki',
            'Shaalan',
            'Rukn Al-Din',
            'Mazzeh',
            'Kafr Sousa',
            'Barzeh',
            'Dummar',
            'Mezzeh 86',
            'Al-Muhajireen',
            'Al-Salihiyah',
            'Old Damascus',
            'Bab Touma',
            'Al-Qanawat',
        ];

        $propertyTypes = ['rent', 'sale', 'hotel'];
        $currencies = ['USD', 'SYP'];
        $type = $this->faker->randomElement($propertyTypes);
        
        // Price ranges based on type and currency
        $price = match($type) {
            'rent' => $this->faker->randomElement([
                $this->faker->numberBetween(200, 800), // USD rent
                $this->faker->numberBetween(500000, 2000000), // SYP rent
            ]),
            'sale' => $this->faker->randomElement([
                $this->faker->numberBetween(50000, 500000), // USD sale
                $this->faker->numberBetween(100000000, 2000000000), // SYP sale
            ]),
            'hotel' => $this->faker->randomElement([
                $this->faker->numberBetween(50, 200), // USD per night
                $this->faker->numberBetween(100000, 500000), // SYP per night
            ]),
        };

        $currency = $this->faker->randomElement($currencies);
        
        // Adjust price if currency is SYP
        if ($currency === 'SYP' && $price < 10000) {
            $price = $this->faker->numberBetween(500000, 5000000);
        }

        $amenities = $this->faker->randomElements([
            'Solar Power 24/7',
            'WiFi',
            'Elevator',
            'Parking',
            'Generator',
            'Air Conditioning',
            'Furnished',
            'Balcony',
            'Garden',
            'Security',
            'Water Tank',
            'Satellite TV',
        ], $this->faker->numberBetween(3, 8));

        $bedrooms = $this->faker->numberBetween(1, 5);
        $bathrooms = $this->faker->numberBetween(1, $bedrooms + 1);
        $areaSqm = $this->faker->numberBetween(50, 300);

        $propertyTitles = [
            ['en' => 'Modern Apartment', 'ar' => 'شقة حديثة'],
            ['en' => 'Luxury Villa', 'ar' => 'فيلا فاخرة'],
            ['en' => 'Cozy Studio', 'ar' => 'استوديو مريح'],
            ['en' => 'Family House', 'ar' => 'منزل عائلي'],
            ['en' => 'Spacious Apartment', 'ar' => 'شقة واسعة'],
            ['en' => 'Elegant Penthouse', 'ar' => 'بنتهاوس أنيق'],
            ['en' => 'Traditional House', 'ar' => 'منزل تقليدي'],
            ['en' => 'Contemporary Home', 'ar' => 'منزل عصري'],
            ['en' => 'Beautiful Residence', 'ar' => 'مسكن جميل'],
            ['en' => 'Stylish Apartment', 'ar' => 'شقة أنيقة'],
        ];

        $titleData = $this->faker->randomElement($propertyTitles);
        $neighborhood = Neighborhood::inRandomOrder()->first() ?? Neighborhood::factory()->create();
        
        $titleEn = $titleData['en'] . ' in ' . $neighborhood->getTranslation('name', 'en');
        $titleAr = $titleData['ar'] . ' في ' . $neighborhood->getTranslation('name', 'ar');

        return [
            'title' => [
                'en' => $titleEn,
                'ar' => $titleAr,
            ],
            'slug' => Str::slug($titleEn) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'description' => [
                'en' => $this->faker->paragraphs(3, true),
                'ar' => $this->faker->paragraphs(3, true),
            ],
            'price' => $price,
            'currency' => $currency,
            'type' => $type,
            'neighborhood_id' => $neighborhood->id,
            'bedrooms' => $bedrooms,
            'bathrooms' => $bathrooms,
            'area_sqm' => $areaSqm,
            'is_verified' => $this->faker->boolean(30), // 30% verified
            'is_featured' => $this->faker->boolean(20), // 20% featured
            'amenities' => $amenities,
            'images' => [], // Will be empty for now, can add placeholder images later
            'video_url' => $this->faker->optional(0.3)->url(), // 30% have video
            'owner_contact' => $this->faker->phoneNumber(),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'sold', 'rented']), // Mostly active
        ];
    }
}
