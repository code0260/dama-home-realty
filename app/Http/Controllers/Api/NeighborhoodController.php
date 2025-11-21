<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NeighborhoodResource;
use App\Http\Traits\HasApiResponse;
use App\Models\Neighborhood;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NeighborhoodController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Neighborhood::select([
                'id', 'name', 'slug', 'city', 'description', 'created_at', 'updated_at',
            ]);

            // Filter by city if provided
            if ($request->filled('city')) {
                $query->where('city', $request->city);
            }

            // Order by name
            $query->orderBy('name');

            $neighborhoods = $query->get();

            return NeighborhoodResource::collection($neighborhoods)->response();
        } catch (\Exception $e) {
            Log::error('NeighborhoodController@index error: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch neighborhoods. Please try again later.',
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $slug)
    {
        try {
            $neighborhood = Neighborhood::select([
                'id', 'name', 'slug', 'city', 'description', 'created_at', 'updated_at',
            ])->where('slug', $slug)->first();

            if (!$neighborhood) {
                return $this->notFoundResponse('Neighborhood not found');
            }

            $resource = new NeighborhoodResource($neighborhood);
            return $resource->response();
        } catch (\Exception $e) {
            Log::error('NeighborhoodController@show error: ' . $e->getMessage(), [
                'slug' => $slug,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch neighborhood. Please try again later.',
                500
            );
        }
    }
}

