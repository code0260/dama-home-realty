<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    use HasApiResponse;

    /**
     * Get user notifications
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->unauthorizedResponse('You must be logged in to view notifications.');
            }

            $perPage = min((int) $request->get('per_page', 20), 100);
            
            $notifications = $user->notifications()
                ->latest()
                ->paginate($perPage);

            return $this->successResponse($notifications, 'Notifications retrieved successfully');
        } catch (\Exception $e) {
            Log::error('NotificationController@index error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch notifications', 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->unauthorizedResponse('You must be logged in.');
            }
            
            $notification = $user->notifications()->find($id);
            
            if (!$notification) {
                return $this->notFoundResponse('Notification not found');
            }

            $notification->markAsRead();

            return $this->successResponse(null, 'Notification marked as read');
        } catch (\Exception $e) {
            Log::error('NotificationController@markAsRead error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to mark notification as read', 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->unauthorizedResponse('You must be logged in.');
            }
            
            $user->unreadNotifications->markAsRead();

            return $this->successResponse(null, 'All notifications marked as read');
        } catch (\Exception $e) {
            Log::error('NotificationController@markAllAsRead error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to mark all notifications as read', 500);
        }
    }
}

