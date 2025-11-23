<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class CacheService
{
    /**
     * Cache dashboard stats
     */
    public function cacheDashboardStats(array $stats, int $ttl = 300): void
    {
        Cache::put('dashboard_stats', $stats, $ttl);
    }

    /**
     * Get cached dashboard stats
     */
    public function getCachedDashboardStats(): ?array
    {
        return Cache::get('dashboard_stats');
    }

    /**
     * Cache analytics data
     */
    public function cacheAnalytics(string $key, array $data, int $ttl = 3600): void
    {
        Cache::put("analytics_{$key}", $data, $ttl);
    }

    /**
     * Get cached analytics
     */
    public function getCachedAnalytics(string $key): ?array
    {
        return Cache::get("analytics_{$key}");
    }

    /**
     * Clear dashboard cache
     */
    public function clearDashboardCache(): void
    {
        Cache::forget('dashboard_stats');
        Cache::tags(['dashboard'])->flush();
    }

    /**
     * Cache with tags
     */
    public function cacheWithTags(string $key, $value, array $tags, int $ttl = 3600): void
    {
        Cache::tags($tags)->put($key, $value, $ttl);
    }

    /**
     * Get from cache with tags
     */
    public function getFromCacheWithTags(string $key, array $tags)
    {
        return Cache::tags($tags)->get($key);
    }
}

