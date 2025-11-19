<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NeighborhoodResource;
use App\Models\Neighborhood;
use Illuminate\Http\Request;

class NeighborhoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Neighborhood::query();

        // Filter by city if provided
        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        // Order by name
        $query->orderBy('name');

        $neighborhoods = $query->get();

        return NeighborhoodResource::collection($neighborhoods);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $neighborhood = Neighborhood::where('slug', $slug)->firstOrFail();

        return new NeighborhoodResource($neighborhood);
    }
}

