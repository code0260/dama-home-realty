<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'name' => [
                'required',
                'string',
                'max:255',
                'min:2',
            ],
            'phone' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\+]?[0-9\s\-\(\)]+$/',
            ],
            'message' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'property_id' => [
                'nullable',
                'integer',
                'exists:properties,id',
            ],
            'status' => [
                'nullable',
                'string',
                'in:new,contacted,closed',
            ],
            'type' => [
                'nullable',
                'string',
                'in:inquiry,live_tour_request,service_request',
            ],
            'preferred_date' => [
                'nullable',
                'string',
                'max:255',
            ],
            'preferred_time' => [
                'nullable',
                'string',
                'max:255',
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
            'name.required' => 'Please provide your name.',
            'name.min' => 'Name must be at least 2 characters.',
            'name.max' => 'Name cannot exceed 255 characters.',
            'phone.required' => 'Please provide your phone number.',
            'phone.regex' => 'Please provide a valid phone number.',
            'message.max' => 'Message cannot exceed 2000 characters.',
            'property_id.exists' => 'The selected property does not exist.',
            'type.in' => 'Invalid request type.',
            'status.in' => 'Invalid status.',
        ];
    }
}

