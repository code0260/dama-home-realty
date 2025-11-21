<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Property;
use App\Models\Neighborhood;
use App\Models\Agent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_lead(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        $property = Property::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
        ]);

        $response = $this->postJson('/api/leads', [
            'name' => 'John Doe',
            'phone' => '+963123456789',
            'message' => 'I am interested in this property',
            'property_id' => $property->id,
            'type' => 'inquiry',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'lead' => [
                             'id',
                             'name',
                             'phone',
                             'status',
                             'type',
                         ],
                     ],
                 ]);

        $this->assertDatabaseHas('leads', [
            'name' => 'John Doe',
            'phone' => '+963123456789',
            'property_id' => $property->id,
        ]);
    }

    public function test_can_create_live_tour_request(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        $property = Property::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
        ]);

        $response = $this->postJson('/api/leads', [
            'name' => 'Jane Doe',
            'phone' => '+963987654321',
            'property_id' => $property->id,
            'type' => 'live_tour_request',
            'preferred_date' => '2025-02-15',
            'preferred_time' => '10:00 AM',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('leads', [
            'type' => 'live_tour_request',
            'preferred_date' => '2025-02-15',
        ]);
    }

    public function test_lead_validation_requires_name(): void
    {
        $response = $this->postJson('/api/leads', [
            'phone' => '+963123456789',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    public function test_lead_validation_requires_phone(): void
    {
        $response = $this->postJson('/api/leads', [
            'name' => 'John Doe',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['phone']);
    }
}

