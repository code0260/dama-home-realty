<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
{
    protected $model = Lead::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'message' => $this->faker->optional()->paragraph(),
            'property_id' => Property::factory(),
            'status' => $this->faker->randomElement(['new', 'new', 'new', 'contacted', 'closed']), // Mostly new
        ];
    }
}
