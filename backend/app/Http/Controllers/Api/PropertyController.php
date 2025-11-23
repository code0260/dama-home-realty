<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Http\Resources\PropertyListResource;
use App\Http\Traits\HasApiResponse;
use App\Models\Booking;
use App\Models\Property;
use App\Services\ImageOptimizationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Optimize query with eager loading to prevent N+1
            // Exclude description and agent from select to reduce payload size
            $query = Property::with([
                'neighborhood:id,name',
                // Agent not needed in list view - exclude to reduce payload
            ])->select([
                'id', 'uuid', 'slug', 'title', 'price', 'currency',
                'type', 'neighborhood_id', 'reference_id',
                'bedrooms', 'bathrooms', 'area_sqm', 'is_verified', 'is_featured',
                'images', 'status', 'created_at', 'updated_at',
            ]);

            // Filter by type
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            // Filter by price range
            if ($request->filled('min_price')) {
                $query->where('price', '>=', (float) $request->min_price);
            }
            if ($request->filled('max_price')) {
                $query->where('price', '<=', (float) $request->max_price);
            }

            // Filter by neighborhood
            if ($request->filled('neighborhood_id')) {
                $query->where('neighborhood_id', (int) $request->neighborhood_id);
            }

            // Filter by bedrooms
            if ($request->filled('bedrooms')) {
                $bedrooms = (int) $request->bedrooms;
                if ($bedrooms >= 4) {
                    $query->where('bedrooms', '>=', 4);
                } else {
                    $query->where('bedrooms', $bedrooms);
                }
            }

            // Filter by bathrooms
            if ($request->filled('bathrooms')) {
                $bathrooms = (int) $request->bathrooms;
                if ($bathrooms >= 3) {
                    $query->where('bathrooms', '>=', 3);
                } else {
                    $query->where('bathrooms', $bathrooms);
                }
            }

            // Filter by featured
            if ($request->boolean('featured')) {
                $query->where('is_featured', true);
            }

            // Filter by verified
            if ($request->boolean('verified')) {
                $query->where('is_verified', true);
            }

            // Filter by status (default: active)
            // Note: Admin users can see pending and draft properties
            $status = $request->get('status', 'active');
            $allowedStatuses = ['active', 'sold', 'rented', 'pending', 'draft'];
            
            // Only allow admin to filter by pending/draft
            // Regular users can only see active properties
            $user = Auth::user();
            $isAdmin = $user && $user->hasAnyRole(['Super Admin', 'Admin', 'Staff']);
            
            if (!$isAdmin) {
                // Regular users can only see active properties (exclude pending/draft)
                $query->whereIn('status', ['active', 'sold', 'rented']);
            } else {
                // Admin can filter by any status including pending/draft
                if (in_array($status, $allowedStatuses)) {
                    $query->where('status', $status);
                }
            }

            // Search in title only (description excluded from list view for performance)
            // Using parameterized queries for security
            if ($request->filled('search')) {
                $search = $request->search;
                $searchTerm = '%' . $search . '%';
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('JSON_EXTRACT(title, "$.en") LIKE ?', [$searchTerm])
                      ->orWhereRaw('JSON_EXTRACT(title, "$.ar") LIKE ?', [$searchTerm]);
                });
            }

            // Order by featured first, then created_at desc
            $query->orderBy('is_featured', 'desc')
                  ->orderBy('created_at', 'desc');

            // Cache featured properties for 30 minutes (1800 seconds)
            // Only cache if no filters are applied (except pagination)
            $hasFilters = $request->filled(['type', 'min_price', 'max_price', 'neighborhood_id', 
                'bedrooms', 'bathrooms', 'featured', 'verified', 'status', 'search']);
            
            $perPage = min((int) $request->get('per_page', 15), 100); // Max 100 per page
            
            if (!$hasFilters && $request->boolean('featured')) {
                // Cache featured properties list
                $cacheKey = 'properties.featured.page.' . $request->get('page', 1) . '.per_page.' . $perPage;
                $properties = Cache::remember($cacheKey, 1800, function () use ($query, $perPage) {
                    return $query->paginate($perPage);
                });
            } else {
                $properties = $query->paginate($perPage);
            }

            // Use lightweight PropertyListResource for list view
            return PropertyListResource::collection($properties)->response();
        } catch (\Exception $e) {
            Log::error('PropertyController@index error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch properties. Please try again later.',
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $identifier)
    {
        try {
            // Check if user is admin
            $user = Auth::user();
            $isAdmin = $user && $user->hasAnyRole(['Super Admin', 'Admin', 'Staff']);
            
            // Optimize query with eager loading to prevent N+1
            $query = Property::with([
                'neighborhood:id,name',
                'agent:id,name,photo,role,phone,languages,license_no',
            ])->select([
                'id', 'uuid', 'slug', 'title', 'description', 'price', 'currency',
                'type', 'neighborhood_id', 'agent_id', 'reference_id',
                'bedrooms', 'bathrooms', 'area_sqm', 'is_verified', 'is_featured',
                'amenities', 'images', 'video_url', 'owner_contact', 'owner_name', 'owner_email', 'status', 'views',
                'wifi_password', 'door_code', 'house_rules', 'full_address',
                'created_at', 'updated_at',
            ])->where(function ($q) use ($identifier) {
                $q->where('uuid', $identifier)
                  ->orWhere('slug', $identifier);
            });
            
            // Only show active/sold/rented properties to regular users
            // Admins can see all properties including pending/draft
            if (!$isAdmin) {
                $query->whereIn('status', ['active', 'sold', 'rented']);
            }
            
            $property = $query->first();

            if (!$property) {
                return $this->notFoundResponse('Property not found');
            }

            // Increment views count (for analytics)
            $property->increment('views');

            // Only show tenant details if user has active booking
            $showTenantDetails = false;
            if (Auth::check()) {
                $activeBooking = Booking::where('property_id', $property->id)
                    ->where('user_id', Auth::id())
                    ->where('booking_status', 'confirmed')
                    ->where('check_out', '>=', now())
                    ->exists();
                $showTenantDetails = $activeBooking;
            }

            // Hide tenant details if not authorized
            if (!$showTenantDetails) {
                $property->makeHidden(['wifi_password', 'door_code', 'house_rules', 'full_address']);
            }

            $resource = new PropertyResource($property);
            return $resource->response();
        } catch (\Exception $e) {
            Log::error('PropertyController@show error: ' . $e->getMessage(), [
                'identifier' => $identifier,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch property. Please try again later.',
                500
            );
        }
    }

    /**
     * Get property availability (blocked dates).
     */
    public function availability(Request $request, string $identifier)
    {
        try {
            $property = Property::select('id')
                ->where(function ($query) use ($identifier) {
                    $query->where('uuid', $identifier)
                          ->orWhere('slug', $identifier);
                })->first();

            if (!$property) {
                return $this->notFoundResponse('Property not found');
            }

            // Get all confirmed bookings (exclude cancelled)
            $bookings = Booking::where('property_id', $property->id)
                ->where('booking_status', '!=', 'cancelled')
                ->where('check_out', '>=', now())
                ->select('check_in', 'check_out')
                ->get();

            // Format blocked dates
            $blockedDates = [];
            foreach ($bookings as $booking) {
                $start = Carbon::parse($booking->check_in);
                $end = Carbon::parse($booking->check_out);
                
                $current = $start->copy();
                while ($current < $end) {
                    $blockedDates[] = $current->format('Y-m-d');
                    $current->addDay();
                }
            }

            return $this->successResponse([
                'property_id' => $property->id,
                'blocked_dates' => array_unique($blockedDates),
                'available' => count($blockedDates) === 0,
            ], 'Availability retrieved successfully');
        } catch (\Exception $e) {
            Log::error('PropertyController@availability error: ' . $e->getMessage(), [
                'identifier' => $identifier,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch availability. Please try again later.',
                500
            );
        }
    }

    /**
     * Store a newly created property.
     */
    public function store(StorePropertyRequest $request)
    {
        try {
            $validated = $request->validated();
            $isDraft = ($validated['status'] ?? 'pending') === 'draft';

            // Handle image uploads
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $imagePaths[] = $path;
                }
            }

            // Format title and description as JSON (translatable)
            // For drafts, use empty defaults if not provided
            $titleText = $validated['title'] ?? ($isDraft ? 'Draft Property' : '');
            $title = [
                'en' => $titleText,
                'ar' => $titleText, // Default to same value, can be updated later
            ];

            $descriptionText = $validated['description'] ?? ($isDraft ? '' : '');
            $description = [
                'en' => $descriptionText,
                'ar' => $descriptionText, // Default to same value, can be updated later
            ];

            // Prepare property data
            $propertyData = [
                'title' => $title,
                'description' => $description,
                'type' => $validated['type'] ?? 'rent',
                'neighborhood_id' => $validated['neighborhood_id'] ?? null,
                'bedrooms' => $validated['bedrooms'] ?? 0,
                'bathrooms' => $validated['bathrooms'] ?? 0,
                'area_sqm' => $validated['area_sqm'] ?? 0,
                'price' => $validated['price'] ?? 0,
                'currency' => $validated['currency'] ?? 'USD',
                'amenities' => $validated['amenities'] ?? [],
                'images' => $imagePaths,
                'video_url' => $validated['video_url'] ?? null,
                'owner_contact' => $validated['owner_contact'] ?? '',
                'owner_name' => $validated['owner_name'] ?? null,
                'owner_email' => $validated['owner_email'] ?? null,
                'status' => $validated['status'] ?? 'pending', // Default to pending for review
                'reference_id' => $validated['reference_id'] ?? null,
            ];

            // Set full_address if latitude/longitude provided
            if (isset($validated['address']) && !empty($validated['address'])) {
                $propertyData['full_address'] = $validated['address'];
            }

            // Use database transaction for atomicity
            $property = DB::transaction(function () use ($propertyData) {
                $property = Property::create($propertyData);

                // Optimize images if service is available
                try {
                    $optimizationService = app(ImageOptimizationService::class);
                    if ($optimizationService && !empty($propertyData['images'])) {
                        $optimizedImages = $optimizationService->optimizeToWebP($propertyData['images'], 'public');
                        $property->update(['images' => $optimizedImages]);
                    }
                } catch (\Exception $e) {
                    // Log error but don't fail the property creation
                    Log::warning('Image optimization failed for property: ' . $e->getMessage());
                }

                return $property->load(['neighborhood', 'agent']);
            });

            $resource = new PropertyResource($property);
            return $resource->response()->setStatusCode(201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('PropertyController@store error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation', 'images']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to create property. Please try again later.',
                500
            );
        }
    }

    /**
     * Update the specified property.
     */
    public function update(Request $request, int $id)
    {
        try {
            $property = Property::findOrFail($id);

            // Check authorization - user must own the property or be admin
            if (Auth::check()) {
                // Allow update if user is admin/staff or owns the property
                $user = Auth::user();
                if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Staff']) && $property->agent_id !== $user->id) {
                    return $this->unauthorizedResponse('You are not authorized to update this property.');
                }
            }

            // Validate request
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255|min:5',
                'type' => 'sometimes|required|in:rent,sale,hotel',
                'description' => 'sometimes|required|string|min:50|max:5000',
                'neighborhood_id' => 'sometimes|required|integer|exists:neighborhoods,id',
                'address' => 'sometimes|required|string|max:500',
                'bedrooms' => 'sometimes|required|integer|min:0|max:20',
                'bathrooms' => 'sometimes|required|integer|min:0|max:20',
                'area_sqm' => 'sometimes|required|numeric|min:1|max:100000',
                'price' => 'sometimes|required|numeric|min:0|max:999999999.99',
                'currency' => 'sometimes|required|in:USD,SYP',
                'amenities' => 'sometimes|nullable|array',
                'images' => 'sometimes|nullable|array|min:1|max:20',
                'video_url' => 'sometimes|nullable|url|max:500',
                'owner_name' => 'sometimes|required|string|max:255|min:2',
                'owner_email' => 'sometimes|required|email|max:255',
                'owner_contact' => 'sometimes|required|string|max:50',
                'status' => 'sometimes|nullable|in:active,draft,pending,sold,rented',
            ]);

            // Handle image uploads (if new images provided)
            if ($request->hasFile('images')) {
                // Delete old images
                if ($property->images) {
                    foreach ($property->images as $oldImage) {
                        if (Storage::disk('public')->exists($oldImage)) {
                            Storage::disk('public')->delete($oldImage);
                        }
                    }
                }

                // Upload new images
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $imagePaths[] = $path;
                }
                $validated['images'] = $imagePaths;
            }

            // Format title and description as JSON if provided
            if (isset($validated['title'])) {
                $validated['title'] = [
                    'en' => $validated['title'],
                    'ar' => $validated['title'], // Default to same value
                ];
            }

            if (isset($validated['description'])) {
                $validated['description'] = [
                    'en' => $validated['description'],
                    'ar' => $validated['description'], // Default to same value
                ];
            }

            // Add owner_name and owner_email if provided
            if (isset($validated['owner_name'])) {
                $validated['owner_name'] = $validated['owner_name'];
            }
            if (isset($validated['owner_email'])) {
                $validated['owner_email'] = $validated['owner_email'];
            }

            // Use database transaction
            $property = DB::transaction(function () use ($property, $validated) {
                $property->update($validated);

                // Optimize images if new images uploaded
                if (isset($validated['images'])) {
                    try {
                        $optimizationService = app(ImageOptimizationService::class);
                        if ($optimizationService) {
                            $optimizedImages = $optimizationService->optimizeToWebP($validated['images'], 'public');
                            $property->update(['images' => $optimizedImages]);
                        }
                    } catch (\Exception $e) {
                        Log::warning('Image optimization failed for property update: ' . $e->getMessage());
                    }
                }

                return $property->load(['neighborhood', 'agent']);
            });

            $resource = new PropertyResource($property);
            return $resource->response();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Property not found');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('PropertyController@update error: ' . $e->getMessage(), [
                'property_id' => $id,
                'request' => $request->except(['password', 'password_confirmation', 'images']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to update property. Please try again later.',
                500
            );
        }
    }

    /**
     * Remove the specified property.
     */
    public function destroy(int $id)
    {
        try {
            $property = Property::findOrFail($id);

            // Check authorization
            if (Auth::check()) {
                $user = Auth::user();
                if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Staff']) && $property->agent_id !== $user->id) {
                    return $this->unauthorizedResponse('You are not authorized to delete this property.');
                }
            }

            // Delete images from storage
            if ($property->images) {
                foreach ($property->images as $image) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            $property->delete();

            return $this->successResponse(null, 'Property deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Property not found');
        } catch (\Exception $e) {
            Log::error('PropertyController@destroy error: ' . $e->getMessage(), [
                'property_id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to delete property. Please try again later.',
                500
            );
        }
    }
}
