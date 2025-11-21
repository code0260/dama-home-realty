<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AgentController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of active agents.
     */
    public function index(Request $request)
    {
        try {
            // Cache agents for 1 hour (3600 seconds) - agents don't change frequently
            $cacheKey = 'agents.active';
            $agents = Cache::remember($cacheKey, 3600, function () {
                return Agent::select(['id', 'name', 'photo', 'role', 'phone', 'languages', 'license_no'])
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(function ($agent) {
                        return [
                            'id' => $agent->id,
                            'name' => $agent->name,
                            'photo' => $agent->photo,
                            'role' => $agent->role,
                            'phone' => $agent->phone,
                            'languages' => $agent->languages ?? [],
                            'license_no' => $agent->license_no,
                        ];
                    });
            });

            return $this->successResponse($agents, 'Agents retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AgentController@index error: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch agents. Please try again later.',
                500
            );
        }
    }
}

