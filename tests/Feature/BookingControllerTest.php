<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use App\Models\Neighborhood;
use App\Models\Agent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create([
            'email' => 'tenant@test.com',
            'password' => Hash::make('password'),
        ]);
        $this->user->assignRole('Tenant');
    }

    public function test_authenticated_user_can_create_booking(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        $property = Property::factory()->create([
            'type' => 'hotel',
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
            'price' => 100,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->postJson('/api/bookings', [
                             'property_id' => $property->id,
                             'check_in' => '2025-03-01',
                             'check_out' => '2025-03-05',
                             'notes' => 'Test booking',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'property_id',
                         'check_in',
                         'check_out',
                         'total_price',
                     ],
                 ]);

        $this->assertDatabaseHas('bookings', [
            'property_id' => $property->id,
            'user_id' => $this->user->id,
            'check_in' => '2025-03-01',
            'check_out' => '2025-03-05',
        ]);
    }

    public function test_booking_prevents_date_overlap(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        $property = Property::factory()->create([
            'type' => 'hotel',
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
            'price' => 100,
        ]);

        // Create first booking
        Booking::create([
            'property_id' => $property->id,
            'user_id' => $this->user->id,
            'check_in' => '2025-03-01',
            'check_out' => '2025-03-05',
            'total_price' => 400,
            'payment_status' => 'pending',
            'booking_status' => 'pending',
        ]);

        // Try to create overlapping booking
        $response = $this->actingAs($this->user, 'sanctum')
                         ->postJson('/api/bookings', [
                             'property_id' => $property->id,
                             'check_in' => '2025-03-03', // Overlaps
                             'check_out' => '2025-03-07',
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['check_in']);
    }

    public function test_authenticated_user_can_list_own_bookings(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        $property = Property::factory()->create([
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
        ]);

        Booking::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->getJson('/api/bookings');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    public function test_unauthenticated_user_cannot_create_booking(): void
    {
        $neighborhood = Neighborhood::factory()->create();
        $agent = Agent::factory()->create();
        $property = Property::factory()->create([
            'type' => 'hotel',
            'neighborhood_id' => $neighborhood->id,
            'agent_id' => $agent->id,
        ]);

        $response = $this->postJson('/api/bookings', [
            'property_id' => $property->id,
            'check_in' => '2025-03-01',
            'check_out' => '2025-03-05',
        ]);

        $response->assertStatus(401);
    }
}

