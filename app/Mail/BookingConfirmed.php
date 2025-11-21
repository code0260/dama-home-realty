<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public Booking $booking;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Load property relationship if not already loaded
        if (!$this->booking->relationLoaded('property')) {
            $this->booking->load('property');
        }

        $propertyTitle = $this->booking->property 
            ? ($this->booking->property->getTranslation('title', 'en') ?? 'Your Property')
            : 'Your Property';

        return new Envelope(
            subject: 'Booking Confirmed - ' . $propertyTitle,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-confirmed',
            with: [
                'booking' => $this->booking,
                'property' => $this->booking->property,
                'user' => $this->booking->user,
                'portalUrl' => config('app.frontend_url') . '/portal',
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
