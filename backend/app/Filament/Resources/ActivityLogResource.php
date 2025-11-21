<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ActivityLogResource\Pages;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Spatie\Activitylog\Models\Activity;

class ActivityLogResource extends Resource
{
    protected static ?string $model = Activity::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    
    protected static ?string $navigationLabel = 'Activity Log';
    
    protected static ?string $navigationGroup = 'System';
    
    protected static ?int $navigationSort = 99;

    public static function canAccess(): bool
    {
        // Only Super Admin can access activity log
        return auth()->user()?->hasRole('Super Admin') ?? false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('log_name')
                    ->label('Log Name')
                    ->disabled(),
                Forms\Components\TextInput::make('description')
                    ->label('Description')
                    ->disabled(),
                Forms\Components\TextInput::make('subject_type')
                    ->label('Subject Type')
                    ->disabled(),
                Forms\Components\TextInput::make('subject_id')
                    ->label('Subject ID')
                    ->disabled(),
                Forms\Components\TextInput::make('causer_type')
                    ->label('Causer Type')
                    ->disabled(),
                Forms\Components\TextInput::make('causer_id')
                    ->label('Causer ID')
                    ->disabled(),
                Forms\Components\KeyValue::make('properties')
                    ->label('Properties')
                    ->disabled(),
                Forms\Components\DateTimePicker::make('created_at')
                    ->label('Created At')
                    ->disabled(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('log_name')
                    ->label('Log Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->label('Description')
                    ->searchable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Subject')
                    ->formatStateUsing(fn ($record) => class_basename($record->subject_type ?? 'N/A'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('subject_id')
                    ->label('Subject ID')
                    ->sortable(),
                Tables\Columns\TextColumn::make('causer.name')
                    ->label('User')
                    ->default('System')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime()
                    ->sortable()
                    ->since(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('log_name')
                    ->label('Log Name')
                    ->options([
                        'default' => 'Default',
                    ]),
                Tables\Filters\SelectFilter::make('subject_type')
                    ->label('Subject Type')
                    ->options([
                        'App\Models\Property' => 'Property',
                        'App\Models\Booking' => 'Booking',
                        'App\Models\Lead' => 'Lead',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('30s');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListActivityLogs::route('/'),
            'view' => Pages\ViewActivityLog::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit($record): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }
}

