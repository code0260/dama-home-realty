<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class SearchService
{
    /**
     * Perform global search across all models
     */
    public function search(string $query, array $filters = []): array
    {
        $results = [
            'properties' => $this->searchProperties($query, $filters),
            'bookings' => $this->searchBookings($query, $filters),
            'leads' => $this->searchLeads($query, $filters),
            'users' => $this->searchUsers($query, $filters),
        ];

        return $results;
    }

    /**
     * Search properties
     */
    protected function searchProperties(string $query, array $filters = []): Collection
    {
        $search = Property::query();

        // Basic search
        $search->where(function ($q) use ($query) {
            $q->where('reference_id', 'like', "%{$query}%")
                ->orWhere('title', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%");
        });

        // Apply filters
        if (isset($filters['type'])) {
            $search->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $search->where('status', $filters['status']);
        }

        if (isset($filters['min_price'])) {
            $search->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $search->where('price', '<=', $filters['max_price']);
        }

        return $search->limit(20)->get();
    }

    /**
     * Search bookings
     */
    protected function searchBookings(string $query, array $filters = []): Collection
    {
        $search = Booking::query()->with(['property', 'user']);

        $search->where(function ($q) use ($query) {
            $q->whereHas('property', function ($propertyQuery) use ($query) {
                $propertyQuery->where('title', 'like', "%{$query}%")
                    ->orWhere('reference_id', 'like', "%{$query}%");
            })
            ->orWhereHas('user', function ($userQuery) use ($query) {
                $userQuery->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            });
        });

        if (isset($filters['status'])) {
            $search->where('booking_status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $search->where('check_in', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $search->where('check_out', '<=', $filters['date_to']);
        }

        return $search->limit(20)->get();
    }

    /**
     * Search leads
     */
    protected function searchLeads(string $query, array $filters = []): Collection
    {
        $search = Lead::query()->with('property');

        $search->where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('phone', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->orWhere('message', 'like', "%{$query}%");
        });

        if (isset($filters['type'])) {
            $search->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $search->where('status', $filters['status']);
        }

        return $search->limit(20)->get();
    }

    /**
     * Search users
     */
    protected function searchUsers(string $query, array $filters = []): Collection
    {
        $search = User::query();

        $search->where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%");
        });

        if (isset($filters['role'])) {
            $search->role($filters['role']);
        }

        return $search->limit(20)->get();
    }

    /**
     * Get search suggestions
     */
    public function getSuggestions(string $query, int $limit = 5): array
    {
        $suggestions = [];

        // Property suggestions
        $properties = Property::where('title', 'like', "%{$query}%")
            ->orWhere('reference_id', 'like', "%{$query}%")
            ->limit($limit)
            ->get(['id', 'title', 'reference_id']);

        foreach ($properties as $property) {
            $suggestions[] = [
                'type' => 'property',
                'text' => $property->getTranslation('title', 'en') ?? $property->reference_id,
                'url' => route('filament.admin.resources.properties.view', $property->id),
            ];
        }

        return $suggestions;
    }

    /**
     * Save search query for user
     */
    public function saveSearch(int $userId, string $query, array $filters = []): void
    {
        // Store in user preferences or separate saved_searches table
        // Implementation depends on requirements
    }
}

