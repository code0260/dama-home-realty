<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    /**
     * Store a newly created lead.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'message' => 'nullable|string',
            'property_id' => 'nullable|exists:properties,id',
            'status' => 'nullable|in:new,contacted,closed',
            'type' => 'nullable|string|in:inquiry,live_tour_request,service_request',
            'preferred_date' => 'nullable|string',
            'preferred_time' => 'nullable|string',
        ]);

        $lead = Lead::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'message' => $validated['message'] ?? null,
            'property_id' => $validated['property_id'] ?? null,
            'status' => $validated['status'] ?? 'new',
            'type' => $validated['type'] ?? 'inquiry',
            'preferred_date' => $validated['preferred_date'] ?? null,
            'preferred_time' => $validated['preferred_time'] ?? null,
        ]);

        return response()->json([
            'message' => 'Thank you for your interest! We will contact you within 24 hours.',
            'success' => true,
            'lead' => $lead,
        ], 201);
    }

    /**
     * Get user's service requests (for tenant portal)
     */
    public function myServices(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Get service requests by matching phone or email
        $services = Lead::where('type', 'service_request')
            ->where(function ($query) use ($user) {
                $query->where('phone', $user->email) // In case phone is stored as email
                      ->orWhere('name', 'like', '%' . $user->name . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($services);
    }
}

