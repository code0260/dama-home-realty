<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Neighborhood;
use App\Models\Agent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_properties(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        
        Property::factory()->count(5)->create([
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/properties');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'uuid',
                             'slug',
                             'title',
                             'price',
                             'type',
                         ],
                     ],
                 ]);
    }

    public function test_can_filter_properties_by_type(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        
        Property::factory()->create([
            'type' => 'sale',
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
            'status' => 'active',
        ]);

        Property::factory()->create([
            'type' => 'rent',
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/properties?type=sale');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $this->assertEquals('sale', $response->json('data.0.type'));
    }

    public function test_can_show_property_by_slug(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        
        $property = Property::factory()->create([
            'slug' => 'test-property',
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
            'status' => 'active',
        ]);

        $response = $this->getJson("/api/properties/{$property->slug}");

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'slug' => 'test-property',
                     ],
                 ]);
    }

    public function test_returns_404_for_nonexistent_property(): void
    {
        $response = $this->getJson('/api/properties/nonexistent-slug');

        $response->assertStatus(404);
    }
}

