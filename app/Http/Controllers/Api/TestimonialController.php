<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials.
     */
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'en');
        $featured = $request->boolean('featured', false);
        
        $query = Testimonial::query();
        
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

        return response()->json($testimonials);
    }
}
