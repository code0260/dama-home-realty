<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContractResource\Pages;
use App\Filament\Resources\ContractResource\RelationManagers;
use App\Models\Contract;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ContractResource extends Resource
{
    protected static ?string $model = Contract::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationLabel = 'Contracts';
    
    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Contract Information')
                    ->schema([
                        Forms\Components\Select::make('booking_id')
                            ->relationship('booking', 'id', fn ($query) => 
                                $query->where('booking_status', 'confirmed')
                                    ->whereDoesntHave('contract')
                            )
                            ->required()
                            ->searchable()
                            ->preload()
                            ->getOptionLabelFromRecordUsing(fn ($record) => 
                                "Booking #{$record->id} - {$record->property->getTranslation('title', 'en')} - {$record->user->name}"
                            )
                            ->label('Booking'),
                        Forms\Components\TextInput::make('contract_number')
                            ->label('Contract Number')
                            ->unique(ignoreRecord: true)
                            ->helperText('Auto-generated if left empty'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'active' => 'Active',
                                'expired' => 'Expired',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('active')
                            ->required(),
                        Forms\Components\DatePicker::make('start_date')
                            ->required()
                            ->native(false),
                        Forms\Components\DatePicker::make('end_date')
                            ->required()
                            ->native(false)
                            ->after('start_date'),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Financial Details')
                    ->schema([
                        Forms\Components\TextInput::make('total_amount')
                            ->required()
                            ->numeric()
                            ->prefix('$')
                            ->label('Total Amount'),
                        Forms\Components\TextInput::make('deposit_amount')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->label('Deposit Amount'),
                        Forms\Components\Select::make('payment_status')
                            ->options([
                                'pending' => 'Pending',
                                'partial' => 'Partial',
                                'paid' => 'Paid',
                                'refunded' => 'Refunded',
                            ])
                            ->default('pending')
                            ->required(),
                    ])
                    ->columns(3),
                
                Forms\Components\Section::make('Contract Terms')
                    ->schema([
                        Forms\Components\Textarea::make('terms')
                            ->label('Terms & Conditions')
                            ->rows(10)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('notes')
                            ->label('Additional Notes')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
                
                Forms\Components\Section::make('Signatures')
                    ->schema([
                        Forms\Components\Toggle::make('signed_by_tenant')
                            ->label('Signed by Tenant'),
                        Forms\Components\Toggle::make('signed_by_owner')
                            ->label('Signed by Owner'),
                        Forms\Components\DateTimePicker::make('signed_at')
                            ->label('Signed At')
                            ->native(false),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('contract_number')
                    ->label('Contract #')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('booking.id')
                    ->label('Booking ID')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('booking.property.title')
                    ->label('Property')
                    ->formatStateUsing(fn ($record) => $record->booking->property->getTranslation('title', 'en'))
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('booking.user.name')
                    ->label('Tenant')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'draft' => 'gray',
                        'expired' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('start_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'info',
                        'pending' => 'warning',
                        'refunded' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\IconColumn::make('signed_by_tenant')
                    ->label('Tenant')
                    ->boolean(),
                Tables\Columns\IconColumn::make('signed_by_owner')
                    ->label('Owner')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'expired' => 'Expired',
                        'cancelled' => 'Cancelled',
                    ]),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'partial' => 'Partial',
                        'paid' => 'Paid',
                        'refunded' => 'Refunded',
                    ]),
                Tables\Filters\Filter::make('signed')
                    ->query(fn (Builder $query): Builder => 
                        $query->where('signed_by_tenant', true)
                            ->where('signed_by_owner', true)
                    )
                    ->label('Fully Signed'),
            ])
            ->actions([
                Tables\Actions\Action::make('view_pdf')
                    ->label('View PDF')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('info')
                    ->visible(fn ($record) => !empty($record->pdf_path))
                    ->url(fn ($record) => asset('storage/' . $record->pdf_path))
                    ->openUrlInNewTab(),
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
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListContracts::route('/'),
            'create' => Pages\CreateContract::route('/create'),
            'edit' => Pages\EditContract::route('/{record}/edit'),
        ];
    }
}
