<x-filament-panels::page>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">Customizable Dashboard</h2>
            <div class="flex gap-2">
                <button 
                    type="button"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    onclick="saveLayout()"
                >
                    Save Layout
                </button>
                <button 
                    type="button"
                    class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    onclick="resetLayout()"
                >
                    Reset to Default
                </button>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p class="text-gray-600 dark:text-gray-400">
                Drag and drop widgets to customize your dashboard layout. 
                Resize widgets by dragging the corners. Click the eye icon to hide/show widgets.
            </p>
        </div>

        <div id="dashboard-grid" class="grid grid-cols-12 gap-4">
            <!-- Widgets will be dynamically loaded here -->
            <div class="col-span-12">
                <x-filament-widgets::widgets 
                    :widgets="$this->getWidgets()"
                    :columns="$this->getColumns()"
                />
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        function saveLayout() {
            // Get current layout configuration
            const widgetsConfig = getWidgetsConfig();
            const gridConfig = getGridConfig();
            
            // Send to backend via Livewire
            @this.call('saveLayout', widgetsConfig, gridConfig)
                .then(() => {
                    alert('Layout saved successfully!');
                })
                .catch((error) => {
                    console.error('Error saving layout:', error);
                    alert('Failed to save layout');
                });
        }

        function resetLayout() {
            if (confirm('Are you sure you want to reset to default layout?')) {
                @this.call('resetLayout')
                    .then(() => {
                        location.reload();
                    });
            }
        }

        function getWidgetsConfig() {
            // Extract widget positions and sizes from DOM
            const widgets = document.querySelectorAll('[data-widget-id]');
            const config = {};
            
            widgets.forEach(widget => {
                const widgetId = widget.getAttribute('data-widget-id');
                const rect = widget.getBoundingClientRect();
                
                config[widgetId] = {
                    visible: !widget.classList.contains('hidden'),
                    position: {
                        x: Math.round(rect.left),
                        y: Math.round(rect.top),
                    },
                    size: {
                        w: Math.round(rect.width),
                        h: Math.round(rect.height),
                    },
                };
            });
            
            return config;
        }

        function getGridConfig() {
            return {
                columns: 12,
                rowHeight: 50,
                margin: [10, 10],
            };
        }

        // Initialize drag and drop (using a library like gridstack.js would be better)
        document.addEventListener('DOMContentLoaded', function() {
            // Basic drag and drop implementation
            // For production, use a library like gridstack.js or react-grid-layout
        });
    </script>
    @endpush
</x-filament-panels::page>

