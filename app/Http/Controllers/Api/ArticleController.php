<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Traits\HasApiResponse;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ArticleController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Optimize query with eager loading
            $query = Article::with([
                'author:id,name,email',
            ])->select([
                'id', 'title', 'slug', 'content', 'image', 'published_at',
                'author_id', 'views', 'is_featured', 'created_at', 'updated_at',
            ])->published()
            ->orderBy('published_at', 'desc');

            // Filter by featured
            if ($request->boolean('featured')) {
                $query->featured();
            }

            // Paginate results
            $perPage = min((int) $request->get('per_page', 12), 100);
            $articles = $query->paginate($perPage);

            return ArticleResource::collection($articles)->response();
        } catch (\Exception $e) {
            Log::error('ArticleController@index error: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch articles. Please try again later.',
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
            $article = Article::with([
                'author:id,name,email',
            ])->select([
                'id', 'title', 'slug', 'content', 'image', 'published_at',
                'author_id', 'views', 'is_featured', 'created_at', 'updated_at',
            ])->where('slug', $slug)
            ->published()
            ->first();

            if (!$article) {
                return $this->notFoundResponse('Article not found');
            }

            // Increment views
            $article->incrementViews();

            $resource = new ArticleResource($article);
            return $resource->response();
        } catch (\Exception $e) {
            Log::error('ArticleController@show error: ' . $e->getMessage(), [
                'slug' => $slug,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch article. Please try again later.',
                500
            );
        }
    }
}
