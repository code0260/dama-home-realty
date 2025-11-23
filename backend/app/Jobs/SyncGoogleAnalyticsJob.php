<?php

namespace App\Jobs;

use App\Services\GoogleAnalyticsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncGoogleAnalyticsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(GoogleAnalyticsService $analyticsService): void
    {
        try {
            Log::info('Starting Google Analytics sync job');
            
            $analyticsService->syncAnalyticsData();
            
            Log::info('Google Analytics sync job completed successfully');
        } catch (\Exception $e) {
            Log::error('Google Analytics sync job failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            
            throw $e;
        }
    }
}

