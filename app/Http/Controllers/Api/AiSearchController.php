<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Neighborhood;
use App\Models\Property;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class AiSearchController extends Controller
{
    /**
     * AI-powered property search using natural language.
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:500',
        ]);

        $userQuery = $request->input('query');

        try {
            // Use OpenAI to extract structured filters from natural language
            $filters = $this->extractFiltersFromQuery($userQuery);

            // Build query based on extracted filters with optimized eager loading
            $query = Property::with([
                'neighborhood:id,name,slug',
                'agent:id,name,photo,phone,role',
            ])->select([
                'id', 'uuid', 'slug', 'title', 'description', 'price', 'currency',
                'type', 'neighborhood_id', 'agent_id', 'bedrooms', 'bathrooms',
                'area_sqm', 'is_verified', 'is_featured', 'amenities', 'images',
                'status', 'created_at',
            ])->where('status', 'active');

            // Apply filters
            if (isset($filters['type'])) {
                $query->where('type', $filters['type']);
            }

            if (isset($filters['min_price'])) {
                $query->where('price', '>=', $filters['min_price']);
            }

            if (isset($filters['max_price'])) {
                $query->where('price', '<=', $filters['max_price']);
            }

            if (isset($filters['neighborhood'])) {
                $neighborhood = Neighborhood::select(['id', 'name', 'slug'])
                    ->where('name->en', 'like', '%' . $filters['neighborhood'] . '%')
                    ->orWhere('name->ar', 'like', '%' . $filters['neighborhood'] . '%')
                    ->first();
                
                if ($neighborhood) {
                    $query->where('neighborhood_id', $neighborhood->id);
                }
            }

            if (isset($filters['bedrooms'])) {
                $bedrooms = (int) $filters['bedrooms'];
                if ($bedrooms >= 4) {
                    $query->where('bedrooms', '>=', 4);
                } else {
                    $query->where('bedrooms', $bedrooms);
                }
            }

            if (isset($filters['bathrooms'])) {
                $bathrooms = (int) $filters['bathrooms'];
                if ($bathrooms >= 3) {
                    $query->where('bathrooms', '>=', 3);
                } else {
                    $query->where('bathrooms', $bathrooms);
                }
            }

            // Search in amenities if specified
            if (isset($filters['amenities'])) {
                foreach ($filters['amenities'] as $amenity) {
                    $query->whereJsonContains('amenities', $amenity);
                }
            }

            // Order by featured first, then created_at desc
            $query->orderBy('is_featured', 'desc')->latest();

            // Paginate results
            $perPage = $request->get('per_page', 15);
            $properties = $query->paginate($perPage);

            return response()->json([
                'query' => $userQuery,
                'extracted_filters' => $filters,
                'data' => PropertyResource::collection($properties),
                'pagination' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'per_page' => $properties->perPage(),
                    'total' => $properties->total(),
                ],
            ]);
        } catch (\Exception $e) {
            // Fallback to simple text search if AI fails
            return $this->fallbackSearch($userQuery, $request);
        }
    }

    /**
     * Extract structured filters from natural language query using OpenAI.
     */
    private function extractFiltersFromQuery(string $query): array
    {
        $systemPrompt = "You are a real estate search assistant. Extract property search filters from user queries.
        
Available property types: apartment, house, villa, hotel, rent
Available neighborhoods in Damascus: Malki, Mezzeh, Kafr Sousa, Abu Rummaneh, Baramkeh, Old City, etc.
Common amenities: wifi, parking, air_conditioning, heating, elevator, balcony, garden, pool, gym, security, solar_power

Return a JSON object with these optional fields:
- type: string (apartment, house, villa, hotel, rent)
- min_price: number
- max_price: number
- neighborhood: string (neighborhood name)
- bedrooms: number
- bathrooms: number
- amenities: array of strings

Examples:
- 'cheap flat in Malki' -> {\"type\": \"apartment\", \"neighborhood\": \"Malki\", \"max_price\": 500}
- 'villa with pool and garden' -> {\"type\": \"villa\", \"amenities\": [\"pool\", \"garden\"]}
- '2 bedroom apartment under 300' -> {\"type\": \"apartment\", \"bedrooms\": 2, \"max_price\": 300}
- 'apartment with solar power' -> {\"type\": \"apartment\", \"amenities\": [\"solar_power\"]}

Return ONLY valid JSON, no other text.";

        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini', // Use cheaper model for cost efficiency
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $query],
                ],
                'temperature' => 0.3,
                'max_tokens' => 200,
            ]);

            $content = $response->choices[0]->message->content;
            
            // Clean the response (remove markdown code blocks if present)
            $content = preg_replace('/```json\s*/', '', $content);
            $content = preg_replace('/```\s*/', '', $content);
            $content = trim($content);

            $filters = json_decode($content, true);
            
            return is_array($filters) ? $filters : [];
        } catch (\Exception $e) {
            \Log::error('AI Search Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Fallback search using simple text matching if AI fails.
     */
    private function fallbackSearch(string $query, Request $request): \Illuminate\Http\JsonResponse
    {
        $searchTerms = explode(' ', strtolower($query));
        
        $query = Property::with(['neighborhood', 'agent'])
            ->where('status', 'active');

        // Simple keyword matching
        foreach ($searchTerms as $term) {
            $query->where(function ($q) use ($term) {
                $q->where('title->en', 'like', '%' . $term . '%')
                  ->orWhere('title->ar', 'like', '%' . $term . '%')
                  ->orWhere('description->en', 'like', '%' . $term . '%')
                  ->orWhere('description->ar', 'like', '%' . $term . '%');
            });
        }

        $perPage = $request->get('per_page', 15);
        $properties = $query->orderBy('is_featured', 'desc')->latest()->paginate($perPage);

        return response()->json([
            'query' => $query,
            'extracted_filters' => [],
            'data' => PropertyResource::collection($properties),
            'pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ],
        ]);
    }
}

