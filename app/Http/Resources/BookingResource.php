<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property' => $this->whenLoaded('property', function () use ($request) {
                $user = $request->user();
                // Check if this booking is active (current stay)
                $hasActiveBooking = $user && $this->booking_status === 'confirmed' 
                    && \Carbon\Carbon::parse($this->check_in)->lte(\Carbon\Carbon::today())
                    && \Carbon\Carbon::parse($this->check_out)->gte(\Carbon\Carbon::today());
                
                return [
                    'id' => $this->property->id,
                    'uuid' => $this->property->uuid,
                    'slug' => $this->property->slug,
                    'title' => $this->property->getTranslation('title', 'en'),
                    'images' => $this->property->images ?? [],
                    // Only include tenant details if user has active booking
                    'tenant_details' => $hasActiveBooking ? [
                        'wifi_password' => $this->property->wifi_password,
                        'door_code' => $this->property->door_code,
                        'house_rules' => $this->property->house_rules,
                        'full_address' => $this->property->full_address,
                    ] : null,
                ];
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'check_in' => $this->check_in->format('Y-m-d'),
            'check_out' => $this->check_out->format('Y-m-d'),
            'nights' => $this->nights,
            'total_price' => $this->total_price,
            'amount_paid' => $this->amount_paid,
            'payment_status' => $this->payment_status,
            'booking_status' => $this->booking_status,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
