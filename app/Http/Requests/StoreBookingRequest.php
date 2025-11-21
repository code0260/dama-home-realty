<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'property_id' => [
                'required',
                'integer',
                'exists:properties,id',
            ],
            'check_in' => [
                'required',
                'date',
                'after:today',
                'date_format:Y-m-d',
            ],
            'check_out' => [
                'required',
                'date',
                'after:check_in',
                'date_format:Y-m-d',
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
            'property_id.required' => 'Please select a property.',
            'property_id.exists' => 'The selected property does not exist.',
            'check_in.required' => 'Check-in date is required.',
            'check_in.after' => 'Check-in date must be in the future.',
            'check_in.date_format' => 'Check-in date format is invalid.',
            'check_out.required' => 'Check-out date is required.',
            'check_out.after' => 'Check-out date must be after check-in date.',
            'check_out.date_format' => 'Check-out date format is invalid.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}

