<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExportReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->hasAnyRole(['Super Admin', 'Admin', 'Manager']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'report_type' => 'required|in:revenue,leads,properties',
            'format' => 'required|in:excel,pdf,csv,json',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'filters' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'report_type.required' => 'Report type is required.',
            'report_type.in' => 'Invalid report type. Allowed: revenue, leads, properties.',
            'format.required' => 'Export format is required.',
            'format.in' => 'Invalid format. Allowed: excel, pdf, csv, json.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
        ];
    }
}

