<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #0F172A;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0F172A;
            margin-bottom: 10px;
        }
        .tagline {
            color: #666;
            font-size: 14px;
        }
        .content {
            margin-bottom: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #0F172A;
        }
        .booking-details {
            background-color: #f9f9f9;
            border-left: 4px solid #B49162;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-value {
            color: #0F172A;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0F172A;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #1e293b;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .highlight {
            color: #B49162;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Dama Home Realty</div>
            <div class="tagline">Your Trusted Partner in Damascus</div>
        </div>

        <div class="content">
            <div class="greeting">
                Hello {{ $user->name }},
            </div>

            <p>We're excited to confirm your booking! Your reservation has been successfully processed.</p>

            <div class="booking-details">
                <h2 style="color: #0F172A; margin-top: 0;">Booking Details</h2>
                
                <div class="detail-row">
                    <span class="detail-label">Property:</span>
                    <span class="detail-value">{{ $property->getTranslation('title', 'en') ?? 'Property' }}</span>
                </div>

                @if($property->reference_id)
                <div class="detail-row">
                    <span class="detail-label">Reference ID:</span>
                    <span class="detail-value">{{ $property->reference_id }}</span>
                </div>
                @endif

                <div class="detail-row">
                    <span class="detail-label">Check-in:</span>
                    <span class="detail-value">{{ $booking->check_in->format('F d, Y') }}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Check-out:</span>
                    <span class="detail-value">{{ $booking->check_out->format('F d, Y') }}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Total Price:</span>
                    <span class="detail-value highlight">
                        {{ number_format($booking->total_price, 2) }} {{ $property->currency ?? 'USD' }}
                    </span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Amount Paid:</span>
                    <span class="detail-value">
                        {{ number_format($booking->amount_paid ?? 0, 2) }} {{ $property->currency ?? 'USD' }}
                    </span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span class="detail-value" style="text-transform: capitalize;">
                        {{ $booking->payment_status ?? 'Pending' }}
                    </span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Booking Status:</span>
                    <span class="detail-value" style="text-transform: capitalize;">
                        {{ $booking->booking_status ?? 'Confirmed' }}
                    </span>
                </div>
            </div>

            <p>You can manage your booking, view property details, and access important information through your Tenant Portal.</p>

            <div style="text-align: center;">
                <a href="{{ $portalUrl }}" class="button">Manage My Booking</a>
            </div>

            <p style="margin-top: 30px;">
                <strong>Important Information:</strong>
            </p>
            <ul>
                <li>Please arrive on time for check-in</li>
                <li>Contact information will be provided in your portal</li>
                <li>If you have any questions, please contact us at <a href="mailto:support@dama-home.com">support@dama-home.com</a></li>
            </ul>

            <p>We look forward to hosting you!</p>

            <p>
                Best regards,<br>
                <strong>The Dama Home Realty Team</strong>
            </p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} Dama Home Realty. All rights reserved.</p>
            <p>
                <a href="{{ config('app.frontend_url') }}/privacy-policy" style="color: #666; text-decoration: none;">Privacy Policy</a> |
                <a href="{{ config('app.frontend_url') }}/terms" style="color: #666; text-decoration: none;">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>

