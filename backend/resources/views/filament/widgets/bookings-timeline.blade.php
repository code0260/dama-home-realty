<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ $this->getHeading() }}
        </x-slot>

        <div class="w-full">
            @php
                $data = $this->getViewData();
                $bookings = $data['bookings'];
                $timeline = $data['timeline'];
            @endphp

            @if($bookings->isEmpty())
                <div class="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-gray-500 dark:text-gray-400">No upcoming bookings in the next 30 days</p>
                </div>
            @else
                <div class="space-y-4">
                    @foreach($timeline as $date => $dayBookings)
                        <div class="border-l-4 border-primary pl-4 py-2">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-900 dark:text-white">
                                    {{ \Carbon\Carbon::parse($date)->format('M d, Y') }}
                                </h4>
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    {{ count($dayBookings) }} {{ count($dayBookings) === 1 ? 'booking' : 'bookings' }}
                                </span>
                            </div>
                            
                            <div class="space-y-2">
                                @foreach($dayBookings as $booking)
                                    <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <p class="font-medium text-gray-900 dark:text-white">
                                                    {{ $booking['property_title'] }}
                                                </p>
                                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                                    Guest: {{ $booking['guest_name'] }}
                                                </p>
                                                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>
                                                        Check-in: {{ \Carbon\Carbon::parse($booking['check_in'])->format('M d') }}
                                                    </span>
                                                    <span>
                                                        Check-out: {{ \Carbon\Carbon::parse($booking['check_out'])->format('M d') }}
                                                    </span>
                                                    <span>
                                                        Duration: {{ $booking['duration'] }} {{ $booking['duration'] === 1 ? 'night' : 'nights' }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="flex flex-col items-end gap-1">
                                                <span class="text-sm font-semibold text-primary">
                                                    ${{ number_format($booking['total_price'], 2) }}
                                                </span>
                                                @if($booking['days_from_now'] >= 0)
                                                    <span class="text-xs px-2 py-1 rounded 
                                                        {{ $booking['days_from_now'] <= 1 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                                           ($booking['days_from_now'] <= 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                                           'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200') }}">
                                                        {{ $booking['days_from_now'] === 0 ? 'Today' : ($booking['days_from_now'] . ' days') }}
                                                    </span>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </x-filament::section>
</x-filament-widgets::widget>

