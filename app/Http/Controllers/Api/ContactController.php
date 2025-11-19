<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Handle contact form submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Log the contact form submission
        Log::info('Contact form submission', $validated);

        // Here you can add email sending logic
        // Mail::to('info@dama-home.com')->send(new ContactMail($validated));

        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you soon.',
            'success' => true,
        ], 201);
    }
}

