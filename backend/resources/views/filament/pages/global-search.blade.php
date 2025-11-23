<x-filament-panels::page>
    <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold mb-4">Global Search</h2>
            
            <form wire:submit.prevent="search" class="space-y-4">
                <div class="flex gap-2">
                    <input 
                        type="text"
                        wire:model.live.debounce.300ms="searchQuery"
                        placeholder="Search properties, bookings, leads, users..."
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button 
                        type="submit"
                        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Search
                    </button>
                    <button 
                        type="button"
                        wire:click="clearSearch"
                        class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Clear
                    </button>
                </div>

                <!-- Advanced Filters -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select wire:model="filters.type" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <option value="">All Types</option>
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                        <option value="hotel">Hotel</option>
                    </select>
                    
                    <select wire:model="filters.status" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </form>
        </div>

        @if($isSearching)
            <div class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>
        @elseif(!empty($searchResults))
            <div class="space-y-6">
                <!-- Properties Results -->
                @if(!empty($searchResults['properties']))
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold mb-4">Properties ({{ count($searchResults['properties']) }})</h3>
                        <div class="space-y-2">
                            @foreach($searchResults['properties'] as $property)
                                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <a href="{{ route('filament.admin.resources.properties.view', $property->id) }}" class="block">
                                        <h4 class="font-semibold">{{ $property->getTranslation('title', 'en') ?? $property->reference_id }}</h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ $property->reference_id }}</p>
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Bookings Results -->
                @if(!empty($searchResults['bookings']))
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold mb-4">Bookings ({{ count($searchResults['bookings']) }})</h3>
                        <div class="space-y-2">
                            @foreach($searchResults['bookings'] as $booking)
                                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <a href="{{ route('filament.admin.resources.bookings.view', $booking->id) }}" class="block">
                                        <h4 class="font-semibold">{{ $booking->property?->getTranslation('title', 'en') ?? 'Unknown Property' }}</h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ $booking->user->name ?? 'Guest' }} - {{ $booking->check_in->format('M d, Y') }}</p>
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Leads Results -->
                @if(!empty($searchResults['leads']))
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold mb-4">Leads ({{ count($searchResults['leads']) }})</h3>
                        <div class="space-y-2">
                            @foreach($searchResults['leads'] as $lead)
                                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <a href="{{ route('filament.admin.resources.leads.view', $lead->id) }}" class="block">
                                        <h4 class="font-semibold">{{ $lead->name }}</h4>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ $lead->type }} - {{ $lead->phone }}</p>
                                    </a>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Users Results -->
                @if(!empty($searchResults['users']))
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold mb-4">Users ({{ count($searchResults['users']) }})</h3>
                        <div class="space-y-2">
                            @foreach($searchResults['users'] as $user)
                                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <h4 class="font-semibold">{{ $user->name }}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ $user->email }}</p>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        @elseif(!empty($searchQuery))
            <div class="text-center py-8">
                <p class="text-gray-600 dark:text-gray-400">No results found for "{{ $searchQuery }}"</p>
            </div>
        @endif
    </div>
</x-filament-panels::page>

