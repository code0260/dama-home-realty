<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity;

class TeamActivity extends BaseWidget
{
    protected static ?string $heading = 'Team Activity Feed';
    
    protected static ?int $sort = 25;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Activity::query()
                    ->with(['causer'])
                    ->orderBy('created_at', 'desc')
            )
            ->columns([
                Tables\Columns\TextColumn::make('causer.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('description')
                    ->label('Action')
                    ->searchable()
                    ->limit(50),
                
                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Model')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Time')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('30s'); // Refresh every 30 seconds
    }
}

