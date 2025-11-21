<x-filament-panels::page>
    <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Database Backup</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
                Create a backup of your database. The backup will include all database tables.
            </p>
            
            <x-filament::button wire:click="createBackup" color="primary" icon="heroicon-o-arrow-down-tray">
                Create Backup Now
            </x-filament::button>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Available Backups</h2>
            
            @php
                $backups = $this->backups;
            @endphp

            @if(empty($backups))
                <p class="text-gray-500 dark:text-gray-400">No backups available yet. Create your first backup above.</p>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b">
                                <th class="pb-2">File Name</th>
                                <th class="pb-2">Size</th>
                                <th class="pb-2">Date</th>
                                <th class="pb-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($backups as $backup)
                                <tr class="border-b">
                                    <td class="py-2">{{ $backup['name'] }}</td>
                                    <td class="py-2">{{ number_format($backup['size'] / 1024 / 1024, 2) }} MB</td>
                                    <td class="py-2">{{ \Carbon\Carbon::createFromTimestamp($backup['date'])->format('Y-m-d H:i:s') }}</td>
                                    <td class="py-2">
                                        @php
                                            $disk = config('backup.backup.destination.disks')[0] ?? 'local';
                                            $url = Storage::disk($disk)->url($backup['path']);
                                        @endphp
                                        <a 
                                            href="{{ $url }}"
                                            class="text-primary-600 hover:text-primary-800"
                                            download
                                        >
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </div>
</x-filament-panels::page>

