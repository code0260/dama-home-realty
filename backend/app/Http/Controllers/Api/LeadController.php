<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Traits\HasApiResponse;
use App\Models\Lead;
use App\Events\LeadCreated;
use App\Notifications\NewLeadNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class LeadController extends Controller
{
    use HasApiResponse;
    /**
     * Store a newly created lead.
     */
    public function store(StoreLeadRequest $request)
    {
        try {
            $validated = $request->validated();

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

            // Load property relationship for notification
            $lead->load('property');

            // Broadcast real-time notification
            event(new LeadCreated($lead));

            // Notify Super Admins (Database + Email) - with eager loading to prevent N+1
            $admins = \App\Models\User::role('Super Admin')->with('roles')->get();
            if ($admins->isNotEmpty()) {
                Notification::send($admins, new NewLeadNotification($lead));
            }

            return $this->successResponse(
                ['lead' => $lead],
                'Thank you for your interest! We will contact you within 24 hours.',
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('LeadController@store error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to submit your request. Please try again later.',
                500
            );
        }
    }

    /**
     * Get user's service requests (for tenant portal)
     */
    public function myServices(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->unauthorizedResponse('You must be logged in to view your services.');
            }

            // Get service requests by matching user_id if available, or by phone/email
            // Note: This assumes leads table might have user_id column in the future
            // For now, we match by phone or email
            $services = Lead::where('type', 'service_request')
                ->select(['id', 'name', 'phone', 'message', 'type', 'status', 'preferred_date', 'preferred_time', 'created_at'])
                ->where(function ($query) use ($user) {
                    // Match by email (if phone field contains email) or by name
                    $query->where('phone', $user->email)
                          ->orWhere('name', 'like', '%' . $user->name . '%');
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->successResponse($services, 'Services retrieved successfully');
        } catch (\Exception $e) {
            Log::error('LeadController@myServices error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch services. Please try again later.',
                500
            );
        }
    }
}

