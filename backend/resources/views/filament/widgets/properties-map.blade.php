<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ static::$heading ?? 'Properties Map' }}
        </x-slot>

        <div class="w-full" style="height: 500px;">
            <div id="properties-map-container" class="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div class="text-center p-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Properties Map</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Map integration available via API endpoint
                    </p>
                    <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Use <code class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">/api/admin/dashboard/properties/map-data</code> to fetch properties data
                    </p>
                    <div class="mt-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Properties Count:</strong> {{ count($this->getViewData()['properties']) }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            This widget can be enhanced with Google Maps integration in the frontend.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>

