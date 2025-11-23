<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow authenticated users or guests to submit property listings
        // Authorization can be checked in the controller if needed
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isDraft = $this->input('status') === 'draft';

        return [
            // Basic Information
            'title' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'string',
                'max:255',
                $isDraft ? 'nullable' : 'min:5',
            ],
            'type' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'in:rent,sale,hotel',
            ],
            'description' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'string',
                $isDraft ? 'nullable' : 'min:50',
                'max:5000',
            ],

            // Location
            'neighborhood_id' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'integer',
                Rule::when($this->filled('neighborhood_id'), Rule::exists('neighborhoods', 'id')),
            ],
            'address' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'string',
                'max:500',
            ],
            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],
            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
            ],

            // Property Details
            'bedrooms' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'integer',
                'min:0',
                'max:20',
            ],
            'bathrooms' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'integer',
                'min:0',
                'max:20',
            ],
            'area_sqm' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'numeric',
                'min:1',
                'max:100000',
            ],
            'price' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'numeric',
                'min:0',
                'max:999999999.99',
            ],
            'currency' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'in:USD,SYP',
            ],
            'amenities' => [
                'nullable',
                'array',
            ],
            'amenities.*' => [
                'string',
                'max:100',
            ],

            // Media
            'images' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'array',
                $isDraft ? 'nullable' : 'min:1',
                'max:20',
            ],
            'images.*' => [
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120', // 5MB max per image
            ],
            'video_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            // Contact & Status
            'owner_name' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'string',
                'max:255',
                $isDraft ? 'nullable' : 'min:2',
            ],
            'owner_email' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'email',
                'max:255',
            ],
            'owner_contact' => [
                $isDraft ? 'sometimes' : 'required',
                'nullable',
                'string',
                'max:50',
            ],
            'reference_id' => [
                'nullable',
                'string',
                'max:50',
                'unique:properties,reference_id',
            ],
            'status' => [
                'nullable',
                'in:active,draft,pending',
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
            'title.required' => 'Property title is required.',
            'title.min' => 'Property title must be at least 5 characters.',
            'title.max' => 'Property title cannot exceed 255 characters.',
            'type.required' => 'Property type is required.',
            'type.in' => 'Property type must be rent, sale, or hotel.',
            'description.required' => 'Property description is required.',
            'description.min' => 'Property description must be at least 50 characters.',
            'description.max' => 'Property description cannot exceed 5000 characters.',
            'neighborhood_id.required' => 'Neighborhood is required.',
            'neighborhood_id.exists' => 'Selected neighborhood does not exist.',
            'address.required' => 'Address is required.',
            'bedrooms.required' => 'Number of bedrooms is required.',
            'bathrooms.required' => 'Number of bathrooms is required.',
            'area_sqm.required' => 'Property area is required.',
            'price.required' => 'Property price is required.',
            'currency.required' => 'Currency is required.',
            'images.required' => 'At least one image is required.',
            'images.min' => 'At least one image is required.',
            'images.max' => 'Maximum 20 images allowed.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Images must be in JPEG, PNG, or WebP format.',
            'images.*.max' => 'Each image cannot exceed 5MB.',
            'owner_name.required' => 'Owner name is required.',
            'owner_email.required' => 'Owner email is required.',
            'owner_email.email' => 'Owner email must be a valid email address.',
            'owner_contact.required' => 'Contact phone is required.',
            'reference_id.unique' => 'This reference ID already exists.',
            'status.in' => 'Status must be active, draft, or pending.',
        ];
    }
}

