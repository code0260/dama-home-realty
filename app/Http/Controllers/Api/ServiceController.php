<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of active services.
     */
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'en');
        
        $services = Service::where('is_active', true)
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

        return response()->json($services);
    }
}
