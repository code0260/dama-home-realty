<?php

namespace App\Traits;

trait HasPagination
{
    /**
     * Get pagination parameters from request
     */
    protected function getPaginationParams($request): array
    {
        $perPage = min((int) $request->get('per_page', 15), 100); // Max 100 per page
        $page = max((int) $request->get('page', 1), 1);

        return [$perPage, $page];
    }

    /**
     * Format paginated response
     */
    protected function paginatedResponse($paginator, string $message = 'Data retrieved successfully'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }
}

