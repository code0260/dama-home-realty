<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of active services.
     */
    public function index(Request $request)
    {
        try {
            $locale = $request->get('locale', 'en');
            
            // Cache services for 2 hours (7200 seconds) - services rarely change
            $cacheKey = 'services.active.' . $locale;
            $services = Cache::remember($cacheKey, 7200, function () use ($locale) {
                return Service::select(['id', 'title', 'description', 'icon', 'sort_order', 'is_active'])
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get()
                    ->map(function ($service) use ($locale) {
                        return [
                            'id' => $service->id,
                            'title' => $service->getTranslation('title', $locale) ?? $service->getTranslation('title', 'en'),
                            'description' => $service->getTranslation('description', $locale) ?? $service->getTranslation('description', 'en'),
                            'icon' => $service->icon,
                            'sort_order' => $service->sort_order,
                        ];
                    });
            });

            return $this->successResponse($services, 'Services retrieved successfully');
        } catch (\Exception $e) {
            Log::error('ServiceController@index error: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch services. Please try again later.',
                500
            );
        }
    }
}
