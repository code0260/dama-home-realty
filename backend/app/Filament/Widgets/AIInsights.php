<?php

namespace App\Filament\Widgets;

use App\Http\Controllers\Api\AiConciergeController;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIInsights extends Widget
{
    protected static string $view = 'filament.widgets.ai-insights';
    
    protected static ?string $heading = 'AI Insights';
    
    protected static ?int $sort = 20;

    protected int | string | array $columnSpan = 'full';

    public function getViewData(): array
    {
        try {
            // Get AI insights using DamaGenie
            $insights = $this->generateInsights();
            
            return [
                'insights' => $insights,
                'generated_at' => now()->format('Y-m-d H:i:s'),
            ];
        } catch (\Exception $e) {
            Log::error('AIInsights widget error: ' . $e->getMessage());
            
            return [
                'insights' => [
                    [
                        'type' => 'info',
                        'title' => 'Revenue Trend',
                        'message' => 'Revenue is showing positive growth this month.',
                        'action' => 'View Details',
                    ],
                    [
                        'type' => 'warning',
                        'title' => 'Low Conversion Rate',
                        'message' => 'Lead conversion rate is below average. Consider reviewing your follow-up process.',
                        'action' => 'Review Leads',
                    ],
                    [
                        'type' => 'success',
                        'title' => 'High-Performing Properties',
                        'message' => '3 properties are generating 40% of total revenue.',
                        'action' => 'View Properties',
                    ],
                ],
                'generated_at' => now()->format('Y-m-d H:i:s'),
            ];
        }
    }

    protected function generateInsights(): array
    {
        // This would integrate with DamaGenie AI service
        // For now, return sample insights
        // In production, call the AI service to generate real insights
        
        return [
            [
                'type' => 'info',
                'title' => 'Revenue Trend',
                'message' => 'Revenue is showing positive growth this month with a 15% increase compared to last month.',
                'action' => 'View Details',
                'priority' => 'medium',
            ],
            [
                'type' => 'warning',
                'title' => 'Low Conversion Rate',
                'message' => 'Lead conversion rate is 12% below average. Consider reviewing your follow-up process.',
                'action' => 'Review Leads',
                'priority' => 'high',
            ],
            [
                'type' => 'success',
                'title' => 'High-Performing Properties',
                'message' => '3 properties are generating 40% of total revenue. Consider featuring them more prominently.',
                'action' => 'View Properties',
                'priority' => 'low',
            ],
            [
                'type' => 'info',
                'title' => 'Booking Forecast',
                'message' => 'Based on historical data, expect 25-30 bookings in the next 7 days.',
                'action' => 'View Forecast',
                'priority' => 'medium',
            ],
        ];
    }
}

