<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ static::$heading ?? 'AI Insights' }}
        </x-slot>

        <div class="space-y-3">
            @php
                $data = $this->getViewData();
                $insights = $data['insights'] ?? [];
            @endphp

            @if(empty($insights))
                <div class="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-gray-500 dark:text-gray-400">No insights available at this time</p>
                </div>
            @else
                @foreach($insights as $insight)
                    <div class="border-l-4 rounded-lg p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                        {{ $insight['type'] === 'success' ? 'border-l-green-500' : 
                           ($insight['type'] === 'warning' ? 'border-l-yellow-500' : 
                           ($insight['type'] === 'error' ? 'border-l-red-500' : 'border-l-blue-500')) }}">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                                    {{ $insight['title'] }}
                                </h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {{ $insight['message'] }}
                                </p>
                            </div>
                            @if(isset($insight['action']))
                                <button class="ml-4 text-sm font-medium text-primary hover:underline">
                                    {{ $insight['action'] }}
                                </button>
                            @endif
                        </div>
                        @if(isset($insight['priority']))
                            <div class="mt-2">
                                <span class="text-xs px-2 py-1 rounded 
                                    {{ $insight['priority'] === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                       ($insight['priority'] === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                       'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200') }}">
                                    {{ ucfirst($insight['priority']) }} Priority
                                </span>
                            </div>
                        @endif
                    </div>
                @endforeach
            @endif

            <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Generated at {{ $data['generated_at'] ?? 'N/A' }}
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>

