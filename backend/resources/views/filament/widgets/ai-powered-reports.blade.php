<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ $this->getHeading() }}
        </x-slot>

        <div class="space-y-6">
            @php
                $data = $this->getViewData();
                $reports = $data['reports'] ?? [];
            @endphp

            <!-- Revenue Prediction -->
            @if(isset($reports['revenue_prediction']))
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Revenue Prediction</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Current Month</p>
                            <p class="text-lg font-bold text-gray-900 dark:text-white">
                                ${{ number_format($reports['revenue_prediction']['current_month'], 2) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Last Month</p>
                            <p class="text-lg font-bold text-gray-900 dark:text-white">
                                ${{ number_format($reports['revenue_prediction']['last_month'], 2) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Growth Rate</p>
                            <p class="text-lg font-bold {{ $reports['revenue_prediction']['growth_rate'] >= 0 ? 'text-green-600' : 'text-red-600' }}">
                                {{ $reports['revenue_prediction']['growth_rate'] >= 0 ? '+' : '' }}{{ number_format($reports['revenue_prediction']['growth_rate'], 1) }}%
                            </p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Predicted Next Month</p>
                            <p class="text-lg font-bold text-primary">
                                ${{ number_format($reports['revenue_prediction']['predicted_next_month'], 2) }}
                            </p>
                            <p class="text-xs text-gray-500">
                                ({{ ucfirst($reports['revenue_prediction']['confidence']) }} confidence)
                            </p>
                        </div>
                    </div>
                </div>
            @endif

            <!-- Lead Scoring -->
            @if(isset($reports['lead_scoring']) && count($reports['lead_scoring']) > 0)
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Top Scored Leads</h3>
                    <div class="space-y-2">
                        @foreach($reports['lead_scoring'] as $lead)
                            <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ $lead['name'] }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $lead['type'] }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-lg font-bold 
                                        {{ $lead['priority'] === 'high' ? 'text-red-600' : 
                                           ($lead['priority'] === 'medium' ? 'text-yellow-600' : 'text-green-600') }}">
                                        {{ $lead['score'] }}
                                    </p>
                                    <p class="text-xs text-gray-500">{{ ucfirst($lead['priority']) }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Property Recommendations -->
            @if(isset($reports['property_recommendations']) && count($reports['property_recommendations']) > 0)
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Recommended Properties</h3>
                    <div class="space-y-2">
                        @foreach($reports['property_recommendations'] as $property)
                            <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900 dark:text-white">{{ $property['title'] }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ $property['booking_count'] }} bookings • ${{ number_format($property['total_revenue'], 2) }} revenue
                                    </p>
                                </div>
                                <span class="text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {{ $property['recommendation'] }}
                                </span>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Anomaly Detection -->
            @if(isset($reports['anomaly_detection']) && count($reports['anomaly_detection']) > 0)
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Anomalies Detected</h3>
                    <div class="space-y-2">
                        @foreach($reports['anomaly_detection'] as $anomaly)
                            <div class="border-l-4 rounded p-3 
                                {{ $anomaly['type'] === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 
                                   ($anomaly['type'] === 'error' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' : 
                                   'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20') }}">
                                <p class="font-medium text-gray-900 dark:text-white">{{ $anomaly['title'] }}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{{ $anomaly['message'] }}</p>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                Generated at {{ $data['generated_at'] ?? 'N/A' }}
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>

