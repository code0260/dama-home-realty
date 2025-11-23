<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class AgentsLeaderboard extends BaseWidget
{
    protected static ?string $heading = 'Agents Leaderboard';
    
    protected static ?int $sort = 14;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                User::role('Agent')
                    ->withCount(['properties', 'bookings'])
                    ->orderBy('properties_count', 'desc')
            )
            ->columns([
                Tables\Columns\TextColumn::make('rank')
                    ->label('Rank')
                    ->getStateUsing(function ($record, $loop) {
                        return $loop->iteration;
                    })
                    ->badge()
                    ->color(fn ($state): string => match (true) {
                        $state === 1 => 'warning', // Gold
                        $state === 2 => 'gray', // Silver
                        $state === 3 => 'info', // Bronze
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('name')
                    ->label('Agent Name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('properties_count')
                    ->label('Properties')
                    ->counts('properties')
                    ->sortable()
                    ->badge()
                    ->color('info'),
                
                Tables\Columns\TextColumn::make('bookings_count')
                    ->label('Bookings')
                    ->counts('bookings')
                    ->sortable()
                    ->badge()
                    ->color('success'),
                
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->limit(30),
            ])
            ->defaultSort('properties_count', 'desc');
    }
}

