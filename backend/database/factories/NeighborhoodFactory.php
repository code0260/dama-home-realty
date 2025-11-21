<?php

namespace Database\Factories;

use App\Models\Neighborhood;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Neighborhood>
 */
class NeighborhoodFactory extends Factory
{
    protected $model = Neighborhood::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $neighborhoods = [
            ['en' => 'Abu Rummaneh', 'ar' => 'أبو رمانة'],
            ['en' => 'Malki', 'ar' => 'المالكي'],
            ['en' => 'Shaalan', 'ar' => 'الشعلان'],
            ['en' => 'Rukn Al-Din', 'ar' => 'ركن الدين'],
            ['en' => 'Mazzeh', 'ar' => 'المزة'],
            ['en' => 'Kafr Sousa', 'ar' => 'كفر سوسة'],
            ['en' => 'Barzeh', 'ar' => 'البرزة'],
            ['en' => 'Dummar', 'ar' => 'دمار'],
            ['en' => 'Mezzeh 86', 'ar' => 'المزة 86'],
            ['en' => 'Al-Muhajireen', 'ar' => 'المهاجرين'],
            ['en' => 'Al-Salihiyah', 'ar' => 'الصالحية'],
            ['en' => 'Old Damascus', 'ar' => 'دمشق القديمة'],
            ['en' => 'Bab Touma', 'ar' => 'باب توما'],
            ['en' => 'Al-Qanawat', 'ar' => 'القنوات'],
        ];

        $neighborhood = $this->faker->unique()->randomElement($neighborhoods);
        $nameEn = $neighborhood['en'];
        $nameAr = $neighborhood['ar'];

        return [
            'name' => [
                'en' => $nameEn,
                'ar' => $nameAr,
            ],
            'slug' => Str::slug($nameEn) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'description' => [
                'en' => $this->faker->paragraph(2),
                'ar' => $this->faker->paragraph(2),
            ],
            'image' => null,
            'city' => 'Damascus',
        ];
    }
}
