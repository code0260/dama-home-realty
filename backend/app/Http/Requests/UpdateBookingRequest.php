<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization is handled in the controller to allow tenants to update their own bookings
        // Admins can update any booking, tenants can only update their own
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booking_status' => [
                'sometimes',
                'string',
                'in:confirmed,cancelled,completed,pending',
            ],
            'payment_status' => [
                'sometimes',
                'string',
                'in:pending,paid,partial,refunded',
            ],
            'amount_paid' => [
                'sometimes',
                'numeric',
                'min:0',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'booking_status.in' => 'Invalid booking status.',
            'payment_status.in' => 'Invalid payment status.',
            'amount_paid.min' => 'Amount paid cannot be negative.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}

