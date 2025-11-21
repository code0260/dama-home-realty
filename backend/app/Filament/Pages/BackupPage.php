<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Spatie\Backup\BackupDestination\BackupDestinationFactory;

class BackupPage extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static string $view = 'filament.pages.backup-page';

    protected static ?string $navigationLabel = 'Database Backup';

    protected static ?int $navigationSort = 999;

    public static function canAccess(): bool
    {
        // Only Super Admin can access backup page
        return auth()->user()?->hasRole('Super Admin') ?? false;
    }

    public function createBackup()
    {
        try {
            // Run backup command
            Artisan::call('backup:run', ['--only-db' => true]);

            Notification::make()
                ->title('Backup Created Successfully')
                ->body('The database backup has been created. Check the list below to download it.')
                ->success()
                ->send();

            $this->dispatch('$refresh');
        } catch (\Exception $e) {
            Notification::make()
                ->title('Backup Failed')
                ->body('Error: ' . $e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function getBackupsProperty()
    {
        try {
            $disk = config('backup.backup.destination.disks')[0] ?? 'local';
            $backupName = config('backup.backup.name', 'dama-home-realty');
            $backupPath = "{$backupName}/";

            if (!Storage::disk($disk)->exists($backupPath)) {
                return [];
            }

            $files = Storage::disk($disk)->files($backupPath);
            
            // Filter only .zip files and sort by modified time (newest first)
            $backups = collect($files)
                ->filter(fn($file) => str_ends_with($file, '.zip'))
                ->map(function ($file) use ($disk) {
                    return [
                        'path' => $file,
                        'name' => basename($file),
                        'size' => Storage::disk($disk)->size($file),
                        'date' => Storage::disk($disk)->lastModified($file),
                    ];
                })
                ->sortByDesc('date')
                ->values()
                ->all();

            return $backups;
        } catch (\Exception $e) {
            return [];
        }
    }
}

