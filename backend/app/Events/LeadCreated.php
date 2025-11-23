<?php

namespace App\Events;

use App\Models\Lead;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Lead $lead;

    /**
     * Create a new event instance.
     */
    public function __construct(Lead $lead)
    {
        $this->lead = $lead->load('property');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast to private channel for Super Admins
        return [
            new PrivateChannel('admin.notifications'),
            new PrivateChannel('admin.dashboard'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'lead.created';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $propertyTitle = $this->lead->property 
            ? ($this->lead->property->getTranslation('title', 'en') ?? 'N/A')
            : 'General Inquiry';

        return [
            'id' => $this->lead->id,
            'lead_name' => $this->lead->name,
            'lead_phone' => $this->lead->phone,
            'lead_type' => $this->lead->type,
            'property_title' => $propertyTitle,
            'message' => "New {$this->lead->type} from {$this->lead->name}",
            'created_at' => $this->lead->created_at->toIso8601String(),
        ];
    }
}

