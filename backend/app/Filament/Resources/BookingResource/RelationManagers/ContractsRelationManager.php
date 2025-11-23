<?php

namespace App\Filament\Resources\BookingResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ContractsRelationManager extends RelationManager
{
    protected static string $relationship = 'contract';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
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
                Forms\Components\TextInput::make('total_amount')
                    ->numeric()
                    ->prefix('$')
                    ->required(),
                Forms\Components\TextInput::make('deposit_amount')
                    ->numeric()
                    ->prefix('$')
                    ->default(0),
                Forms\Components\Select::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'partial' => 'Partial',
                        'paid' => 'Paid',
                        'refunded' => 'Refunded',
                    ])
                    ->default('pending')
                    ->required(),
                Forms\Components\Textarea::make('terms')
                    ->label('Terms & Conditions')
                    ->rows(6)
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('signed_by_tenant')
                    ->label('Signed by Tenant'),
                Forms\Components\Toggle::make('signed_by_owner')
                    ->label('Signed by Owner'),
            ])
            ->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('contract_number')
            ->columns([
                Tables\Columns\TextColumn::make('contract_number')
                    ->label('Contract #')
                    ->badge()
                    ->color('primary')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'draft' => 'gray',
                        'expired' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('start_date')
                    ->date(),
                Tables\Columns\TextColumn::make('end_date')
                    ->date(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->money('USD'),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'info',
                        'pending' => 'warning',
                        'refunded' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\IconColumn::make('signed_by_tenant')
                    ->label('Tenant')
                    ->boolean(),
                Tables\Columns\IconColumn::make('signed_by_owner')
                    ->label('Owner')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
