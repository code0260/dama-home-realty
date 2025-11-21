<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationLabel = 'Bookings';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Booking Details')
                    ->schema([
                        Forms\Components\Select::make('property_id')
                            ->relationship('property', 'title', fn ($query) => $query->whereIn('type', ['hotel', 'rent']))
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('Property'),
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('Tenant'),
                        Forms\Components\DatePicker::make('check_in')
                            ->required()
                            ->label('Check-in Date')
                            ->native(false)
                            ->displayFormat('d/m/Y'),
                        Forms\Components\DatePicker::make('check_out')
                            ->required()
                            ->label('Check-out Date')
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->after('check_in'),
                        Forms\Components\Textarea::make('notes')
                            ->label('Notes')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('Payment & Status')
                    ->schema([
                        Forms\Components\TextInput::make('total_price')
                            ->numeric()
                            ->prefix('$')
                            ->required()
                            ->label('Total Price'),
                        Forms\Components\TextInput::make('amount_paid')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->required()
                            ->label('Amount Paid'),
                        Forms\Components\Select::make('payment_status')
                            ->options([
                                'pending' => 'Pending',
                                'paid' => 'Paid',
                                'partial' => 'Partial',
                                'refunded' => 'Refunded',
                            ])
                            ->required()
                            ->default('pending')
                            ->label('Payment Status'),
                        Forms\Components\Select::make('booking_status')
                            ->options([
                                'pending' => 'Pending',
                                'confirmed' => 'Confirmed',
                                'cancelled' => 'Cancelled',
                                'completed' => 'Completed',
                            ])
                            ->required()
                            ->default('pending')
                            ->label('Booking Status'),
                        Forms\Components\TextInput::make('stripe_checkout_session_id')
                            ->label('Stripe Session ID')
                            ->disabled()
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Tenant')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('check_in')
                    ->date('d/m/Y')
                    ->label('Check-in')
                    ->sortable(),
                Tables\Columns\TextColumn::make('check_out')
                    ->date('d/m/Y')
                    ->label('Check-out')
                    ->sortable(),
                Tables\Columns\TextColumn::make('nights')
                    ->label('Nights')
                    ->getStateUsing(fn (Booking $record) => $record->nights)
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_price')
                    ->money('USD')
                    ->label('Total Price')
                    ->sortable(),
                Tables\Columns\TextColumn::make('amount_paid')
                    ->money('USD')
                    ->label('Paid')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'partial' => 'info',
                        'refunded' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->label('Payment'),
                Tables\Columns\TextColumn::make('booking_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'cancelled' => 'danger',
                        'completed' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->label('Status'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('booking_status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'cancelled' => 'Cancelled',
                        'completed' => 'Completed',
                    ])
                    ->label('Status'),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'partial' => 'Partial',
                        'refunded' => 'Refunded',
                    ])
                    ->label('Payment'),
                Tables\Filters\Filter::make('check_in')
                    ->form([
                        Forms\Components\DatePicker::make('check_in_from')
                            ->label('Check-in From'),
                        Forms\Components\DatePicker::make('check_in_to')
                            ->label('Check-in To'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['check_in_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('check_in', '>=', $date),
                            )
                            ->when(
                                $data['check_in_to'],
                                fn (Builder $query, $date): Builder => $query->whereDate('check_in', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('whatsapp')
                    ->label('Chat')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('success')
                    ->url(function ($record) {
                        $phone = $record->property->owner_contact ?? null;
                        if ($phone) {
                            // Clean phone number: remove all non-numeric characters
                            $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
                            return 'https://wa.me/' . $cleanPhone;
                        }
                        return null;
                    })
                    ->openUrlInNewTab()
                    ->visible(fn ($record) => !empty($record->property->owner_contact ?? null)),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn () => auth()->user()->hasRole('Super Admin')),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->visible(fn () => auth()->user()->hasRole('Super Admin')),
                ]),
            ])
            ->defaultSort('check_in', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
