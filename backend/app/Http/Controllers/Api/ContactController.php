<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    use HasApiResponse;

    /**
     * Handle contact form submission.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|min:2',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:2000',
            ]);

            // Log the contact form submission (without sensitive data)
            Log::info('Contact form submission', [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
            ]);

            // Here you can add email sending logic
            // Mail::to('info@dama-home.com')->send(new ContactMail($validated));

            return $this->successResponse(
                null,
                'Thank you for contacting us! We will get back to you soon.',
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('ContactController@store error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to submit your message. Please try again later.',
                500
            );
        }
    }
}

