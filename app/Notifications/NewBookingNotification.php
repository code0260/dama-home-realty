<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Booking $booking
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
        $propertyTitle = $this->booking->property 
            ? ($this->booking->property->getTranslation('title', 'en') ?? 'N/A')
            : 'Unknown Property';

        $userName = $this->booking->user ? $this->booking->user->name : 'Guest';

        return (new MailMessage)
            ->subject('New Booking: ' . $propertyTitle)
            ->line("A new booking has been created by {$userName}.")
            ->line("Property: {$propertyTitle}")
            ->line("Check-in: {$this->booking->check_in->format('M d, Y')}")
            ->line("Check-out: {$this->booking->check_out->format('M d, Y')}")
            ->line("Total Price: {$this->booking->total_price} USD")
            ->action('View Booking', url('/admin/bookings/' . $this->booking->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $propertyTitle = $this->booking->property 
            ? ($this->booking->property->getTranslation('title', 'en') ?? 'N/A')
            : 'Unknown Property';

        $userName = $this->booking->user ? $this->booking->user->name : 'Guest';

        return [
            'booking_id' => $this->booking->id,
            'user_name' => $userName,
            'property_title' => $propertyTitle,
            'check_in' => $this->booking->check_in->toDateString(),
            'check_out' => $this->booking->check_out->toDateString(),
            'total_price' => $this->booking->total_price,
            'message' => "New booking from {$userName} for {$propertyTitle}",
        ];
    }
}
