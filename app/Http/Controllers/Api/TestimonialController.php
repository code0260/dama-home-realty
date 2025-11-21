<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestimonialController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of testimonials.
     */
    public function index(Request $request)
    {
        try {
            $locale = $request->get('locale', 'en');
            $featured = $request->boolean('featured', false);
            
            $query = Testimonial::select([
                'id', 'client_name', 'country_flag', 'comment', 'rating',
                'photo', 'is_featured', 'sort_order', 'created_at', 'updated_at',
            ]);
            
            if ($featured) {
                $query->where('is_featured', true);
            }
            
            $testimonials = $query->orderBy('sort_order')
                ->get()
                ->map(function ($testimonial) use ($locale) {
                    return [
                        'id' => $testimonial->id,
                        'client_name' => $testimonial->client_name,
                        'country_flag' => $testimonial->country_flag,
                        'comment' => $testimonial->getTranslation('comment', $locale) ?? $testimonial->getTranslation('comment', 'en'),
                        'rating' => $testimonial->rating,
                        'photo' => $testimonial->photo,
                        'is_featured' => $testimonial->is_featured,
                    ];
                });

            return $this->successResponse($testimonials, 'Testimonials retrieved successfully');
        } catch (\Exception $e) {
            Log::error('TestimonialController@index error: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch testimonials. Please try again later.',
                500
            );
        }
    }
}
