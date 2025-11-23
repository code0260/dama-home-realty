<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Booking $booking;
    public float $amount;

    /**
     * Create a new event instance.
     */
    public function __construct(Booking $booking, float $amount)
    {
        $this->booking = $booking;
        $this->amount = $amount;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin.dashboard'),
            new PrivateChannel('user.' . $this->booking->user_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'payment.received';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'booking_id' => $this->booking->id,
            'amount' => $this->amount,
            'currency' => $this->booking->currency ?? 'USD',
            'timestamp' => now()->toIso8601String(),
        ];
    }
}

