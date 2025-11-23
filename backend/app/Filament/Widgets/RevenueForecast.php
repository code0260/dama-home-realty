<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class RevenueForecast extends ChartWidget
{
    protected static ?string $heading = 'Revenue Forecast (Next 3 Months)';
    
    protected static ?int $sort = 7;

    protected function getData(): array
    {
        // Get historical data for the last 12 months
        $historicalData = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthRevenue = Booking::where('payment_status', 'paid')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('amount_paid');
            $historicalData[] = (float) $monthRevenue;
        }

        // Simple moving average forecast (can be replaced with AI prediction later)
        $forecast = $this->calculateForecast($historicalData, 3);

        $labels = [];
        $actualData = [];
        $forecastData = [];

        // Historical labels and data
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $labels[] = $date->format('M Y');
            $actualData[] = $historicalData[11 - $i];
            $forecastData[] = null; // No forecast for historical data
        }

        // Forecast labels and data
        for ($i = 1; $i <= 3; $i++) {
            $date = Carbon::now()->addMonths($i);
            $labels[] = $date->format('M Y') . ' (Forecast)';
            $actualData[] = null; // No actual data for future
            $forecastData[] = $forecast[$i - 1];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Actual Revenue',
                    'data' => $actualData,
                    'backgroundColor' => 'rgba(180, 145, 98, 0.15)',
                    'borderColor' => '#B49162', // Bronze
                    'borderWidth' => 3,
                    'fill' => false,
                    'tension' => 0.4,
                    'pointBackgroundColor' => '#B49162',
                    'pointBorderColor' => '#ffffff',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 5,
                ],
                [
                    'label' => 'Forecasted Revenue',
                    'data' => $forecastData,
                    'backgroundColor' => 'rgba(15, 23, 42, 0.1)',
                    'borderColor' => '#0F172A', // Navy Blue
                    'borderWidth' => 2,
                    'borderDash' => [5, 5], // Dashed line for forecast
                    'fill' => false,
                    'tension' => 0.4,
                    'pointBackgroundColor' => '#0F172A',
                    'pointBorderColor' => '#ffffff',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 4,
                    'pointStyle' => 'circle',
                ],
            ],
            'labels' => $labels,
        ];
    }

    /**
     * Simple moving average forecast (can be replaced with AI/DamaGenie later)
     */
    private function calculateForecast(array $historicalData, int $periods): array
    {
        $forecast = [];
        
        // Calculate average of last 3 months
        $lastThreeMonths = array_slice($historicalData, -3);
        $average = array_sum($lastThreeMonths) / count($lastThreeMonths);
        
        // Simple trend calculation
        $trend = 0;
        if (count($historicalData) >= 2) {
            $recent = array_slice($historicalData, -3);
            $older = array_slice($historicalData, -6, 3);
            if (count($older) > 0) {
                $recentAvg = array_sum($recent) / count($recent);
                $olderAvg = array_sum($older) / count($older);
                $trend = ($recentAvg - $olderAvg) / count($older);
            }
        }

        // Generate forecast
        for ($i = 0; $i < $periods; $i++) {
            $forecast[] = max(0, $average + ($trend * ($i + 1)));
        }

        return $forecast;
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
                'tooltip' => [
                    'enabled' => true,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'callback' => 'function(value) { return "$" + value.toLocaleString(); }',
                    ],
                ],
            ],
        ];
    }
}

