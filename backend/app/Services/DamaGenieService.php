<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class DamaGenieService
{
    /**
     * Generate AI insights for the dashboard
     *
     * @param array $context Additional context data
     * @return array
     */
    public function generateInsights(array $context = []): array
    {
        try {
            // Get recent data for context
            $recentBookings = Booking::where('created_at', '>=', now()->subDays(30))->count();
            $recentLeads = Lead::where('created_at', '>=', now()->subDays(30))->count();
            $totalRevenue = Booking::where('payment_status', 'paid')
                ->where('created_at', '>=', now()->subDays(30))
                ->sum('amount_paid');

            $prompt = "You are Dama Genie, an AI assistant for Dama Home Realty dashboard. ";
            $prompt .= "Analyze the following data and provide 3-5 key insights:\n\n";
            $prompt .= "Recent Bookings (last 30 days): {$recentBookings}\n";
            $prompt .= "Recent Leads (last 30 days): {$recentLeads}\n";
            $prompt .= "Total Revenue (last 30 days): {$totalRevenue}\n\n";
            $prompt .= "Provide actionable insights in JSON format with: type (info/warning/success), title, message, priority (low/medium/high), and action.";

            // Call OpenAI API
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are Dama Genie, a real estate analytics AI assistant. Provide concise, actionable insights in JSON format.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.7,
                'max_tokens' => 500,
            ]);

            $content = $response->choices[0]->message->content;
            
            // Try to parse JSON from response
            $insights = json_decode($content, true);
            
            if (json_last_error() === JSON_ERROR_NONE && is_array($insights)) {
                return $insights;
            }

            // Fallback to default insights if parsing fails
            return $this->getDefaultInsights();
        } catch (\Exception $e) {
            Log::error('DamaGenieService@generateInsights error: ' . $e->getMessage());
            return $this->getDefaultInsights();
        }
    }

    /**
     * Generate revenue forecast using AI
     *
     * @param int $months Number of months to forecast
     * @return array
     */
    public function generateRevenueForecast(int $months = 3): array
    {
        try {
            // Get historical revenue data
            $historicalData = [];
            for ($i = 11; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $monthRevenue = Booking::where('payment_status', 'paid')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('amount_paid');
                $historicalData[] = [
                    'month' => $date->format('Y-m'),
                    'revenue' => (float) $monthRevenue,
                ];
            }

            $prompt = "Based on the following historical revenue data, forecast revenue for the next {$months} months:\n\n";
            $prompt .= json_encode($historicalData, JSON_PRETTY_PRINT) . "\n\n";
            $prompt .= "Return a JSON array with forecasted revenue for each month.";

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a financial forecasting AI. Analyze revenue trends and provide accurate forecasts in JSON format.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.3,
                'max_tokens' => 300,
            ]);

            $content = $response->choices[0]->message->content;
            $forecast = json_decode($content, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($forecast)) {
                return $forecast;
            }

            // Fallback to simple moving average
            return $this->calculateSimpleForecast($historicalData, $months);
        } catch (\Exception $e) {
            Log::error('DamaGenieService@generateRevenueForecast error: ' . $e->getMessage());
            return $this->calculateSimpleForecast(
                array_map(fn($d) => $d['revenue'], $historicalData),
                $months
            );
        }
    }

    /**
     * Score a lead using AI
     *
     * @param Lead $lead
     * @return array
     */
    public function scoreLead(Lead $lead): array
    {
        try {
            $prompt = "Score this real estate lead on a scale of 0-100:\n\n";
            $prompt .= "Name: {$lead->name}\n";
            $prompt .= "Type: {$lead->type}\n";
            $prompt .= "Phone: {$lead->phone}\n";
            $prompt .= "Message: {$lead->message}\n";
            $prompt .= "Property: " . ($lead->property ? $lead->property->getTranslation('title', 'en') : 'N/A') . "\n\n";
            $prompt .= "Return JSON with: score (0-100), confidence (0-1), reasoning (brief explanation), and recommended_action.";

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a lead scoring AI for real estate. Score leads based on quality, intent, and conversion potential.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.5,
                'max_tokens' => 200,
            ]);

            $content = $response->choices[0]->message->content;
            $score = json_decode($content, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($score)) {
                return $score;
            }

            // Fallback scoring
            return [
                'score' => 50,
                'confidence' => 0.5,
                'reasoning' => 'Unable to generate AI score',
                'recommended_action' => 'Follow up',
            ];
        } catch (\Exception $e) {
            Log::error('DamaGenieService@scoreLead error: ' . $e->getMessage());
            return [
                'score' => 50,
                'confidence' => 0.5,
                'reasoning' => 'Error generating score',
                'recommended_action' => 'Follow up',
            ];
        }
    }

    /**
     * Get default insights when AI is unavailable
     *
     * @return array
     */
    private function getDefaultInsights(): array
    {
        return [
            [
                'type' => 'info',
                'title' => 'Revenue Trend',
                'message' => 'Revenue is showing positive growth this month.',
                'priority' => 'medium',
                'action' => 'View Details',
            ],
            [
                'type' => 'warning',
                'title' => 'Low Conversion Rate',
                'message' => 'Lead conversion rate is below average. Consider reviewing your follow-up process.',
                'priority' => 'high',
                'action' => 'Review Leads',
            ],
            [
                'type' => 'success',
                'title' => 'High-Performing Properties',
                'message' => 'Some properties are generating significant revenue.',
                'priority' => 'low',
                'action' => 'View Properties',
            ],
        ];
    }

    /**
     * Calculate simple forecast using moving average
     *
     * @param array $historicalData
     * @param int $months
     * @return array
     */
    private function calculateSimpleForecast(array $historicalData, int $months): array
    {
        $forecast = [];
        
        if (empty($historicalData)) {
            return array_fill(0, $months, 0);
        }

        // Calculate average of last 3 months
        $lastThreeMonths = array_slice($historicalData, -3);
        $average = array_sum($lastThreeMonths) / count($lastThreeMonths);
        
        // Simple trend calculation
        $trend = 0;
        if (count($historicalData) >= 6) {
            $recent = array_slice($historicalData, -3);
            $older = array_slice($historicalData, -6, 3);
            if (count($older) > 0) {
                $recentAvg = array_sum($recent) / count($recent);
                $olderAvg = array_sum($older) / count($older);
                $trend = ($recentAvg - $olderAvg) / 3;
            }
        }

        // Generate forecast
        for ($i = 0; $i < $months; $i++) {
            $forecast[] = max(0, $average + ($trend * ($i + 1)));
        }

        return $forecast;
    }
}

