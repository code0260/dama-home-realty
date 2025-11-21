<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLeadNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Lead $lead
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $propertyTitle = $this->lead->property 
            ? ($this->lead->property->getTranslation('title', 'en') ?? 'N/A')
            : 'General Inquiry';

        return (new MailMessage)
            ->subject('New Lead: ' . $this->lead->name)
            ->line("A new lead has been received from {$this->lead->name}.")
            ->line("Phone: {$this->lead->phone}")
            ->line("Type: " . ucfirst(str_replace('_', ' ', $this->lead->type ?? 'inquiry')))
            ->line("Property: {$propertyTitle}")
            ->action('View Lead', url('/admin/leads/' . $this->lead->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $propertyTitle = $this->lead->property 
            ? ($this->lead->property->getTranslation('title', 'en') ?? 'N/A')
            : 'General Inquiry';

        return [
            'lead_id' => $this->lead->id,
            'lead_name' => $this->lead->name,
            'lead_phone' => $this->lead->phone,
            'lead_type' => $this->lead->type,
            'property_title' => $propertyTitle,
            'message' => "New {$this->lead->type} from {$this->lead->name}",
        ];
    }
}
