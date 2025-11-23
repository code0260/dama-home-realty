<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Carbon;

class UpcomingBookings extends BaseWidget
{
    protected static ?string $heading = 'Upcoming Bookings (Next 7 Days)';
    
    protected static ?int $sort = 11;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        $nextWeek = Carbon::now()->addDays(7);

        return $table
            ->query(
                Booking::query()
                    ->with(['property', 'user'])
                    ->where('booking_status', 'confirmed')
                    ->whereBetween('check_in', [Carbon::now(), $nextWeek])
                    ->orderBy('check_in', 'asc')
            )
            ->columns([
                Tables\Columns\TextColumn::make('property.title')
                    ->label('Property')
                    ->getStateUsing(fn (Booking $record) => 
                        $record->property ? 
                            ($record->property->getTranslation('title', 'en') ?? 
                             $record->property->getTranslation('title', 'ar') ?? 
                             'Unknown') : 
                            'Unknown'
                    )
                    ->searchable()
                    ->limit(30),
                
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Guest')
                    ->searchable(),
                
                Tables\Columns\TextColumn::make('check_in')
                    ->label('Check-in')
                    ->dateTime('M d, Y')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('check_out')
                    ->label('Check-out')
                    ->dateTime('M d, Y')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total Price')
                    ->money('USD')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'warning',
                        'pending' => 'danger',
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('days_until')
                    ->label('Days Until')
                    ->getStateUsing(function (Booking $record) {
                        $days = Carbon::now()->diffInDays($record->check_in, false);
                        return $days >= 0 ? $days . ' days' : 'Past';
                    })
                    ->badge()
                    ->color(function (string $state): string {
                        $days = (int) str_replace([' days', 'Past'], '', $state);
                        if ($days < 0) return 'danger';
                        if ($days <= 1) return 'warning';
                        return 'info';
                    }),
            ])
            ->defaultSort('check_in', 'asc');
    }
}

