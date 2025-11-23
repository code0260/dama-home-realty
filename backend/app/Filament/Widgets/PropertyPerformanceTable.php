<?php

namespace App\Filament\Widgets;

use App\Models\Property;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PropertyPerformanceTable extends BaseWidget
{
    protected static ?string $heading = 'Top Performing Properties';
    
    protected static ?int $sort = 9;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Property::query()
                    ->with(['neighborhood', 'agent'])
                    ->withCount('bookings')
                    ->orderBy('views', 'desc')
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Property')
                    ->getStateUsing(fn (Property $record) => 
                        $record->getTranslation('title', 'en') ?? 
                        $record->getTranslation('title', 'ar') ?? 
                        'Unknown'
                    )
                    ->searchable()
                    ->limit(40)
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('neighborhood.name')
                    ->label('Neighborhood')
                    ->getStateUsing(fn (Property $record) => 
                        $record->neighborhood ? 
                            (is_array($record->neighborhood->name) ? 
                                ($record->neighborhood->name['en'] ?? $record->neighborhood->name['ar'] ?? 'Unknown') : 
                                $record->neighborhood->name) : 
                            'Unknown'
                    )
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'hotel' => 'info',
                        'rent' => 'success',
                        'sale' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->money('USD')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('bookings_count')
                    ->label('Bookings')
                    ->counts('bookings')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'pending' => 'warning',
                        'sold' => 'info',
                        'rented' => 'info',
                        default => 'gray',
                    })
                    ->sortable(),
            ])
            ->defaultSort('views', 'desc');
    }
}

