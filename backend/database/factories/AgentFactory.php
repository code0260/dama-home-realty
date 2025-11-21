<?php

namespace Database\Factories;

use App\Models\Agent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agent>
 */
class AgentFactory extends Factory
{
    protected $model = Agent::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roles = [
            'Real Estate Agent',
            'Senior Real Estate Consultant',
            'Property Manager',
            'Real Estate Broker',
        ];

        $languages = [
            ['English', 'Arabic'],
            ['English', 'Arabic', 'French'],
            ['Arabic', 'English'],
        ];

        return [
            'name' => $this->faker->name(),
            'photo' => null,
            'role' => $this->faker->randomElement($roles),
            'phone' => '+963 11 ' . $this->faker->numerify('### ####'),
            'languages' => $this->faker->randomElement($languages),
            'license_no' => 'LIC-' . $this->faker->unique()->numerify('######'),
            'is_active' => true,
        ];
    }
}

