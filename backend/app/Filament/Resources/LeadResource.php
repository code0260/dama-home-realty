<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeadResource\Pages;
use App\Filament\Resources\LeadResource\RelationManagers;
use App\Models\Lead;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    
    protected static ?string $navigationLabel = 'Leads';
    
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Lead Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->required()
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('message')
                            ->rows(4)
                            ->columnSpanFull(),
                        Forms\Components\Select::make('property_id')
                            ->relationship('property', 'title', fn ($query) => $query->where('status', 'active'))
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->getTranslation('title', 'en'))
                            ->searchable()
                            ->preload()
                            ->nullable(),
                        Forms\Components\Select::make('type')
                            ->options([
                                'inquiry' => 'General Inquiry',
                                'live_tour_request' => 'Live Tour Request',
                                'service_request' => 'Service Request',
                            ])
                            ->default('inquiry'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'new' => 'New',
                                'contacted' => 'Contacted',
                                'closed' => 'Closed',
                            ])
                            ->default('new')
                            ->required(),
                        Forms\Components\TextInput::make('preferred_date')
                            ->label('Preferred Date')
                            ->type('date'),
                        Forms\Components\TextInput::make('preferred_time')
                            ->label('Preferred Time')
                            ->type('time'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable()
                    ->icon('heroicon-m-phone'),
                Tables\Columns\TextColumn::make('property.title')
                    ->label('Property')
                    ->formatStateUsing(fn ($record) => $record->property 
                        ? ($record->property->getTranslation('title', app()->getLocale()) ?? $record->property->getTranslation('title', 'en'))
                        : 'N/A')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'live_tour_request' => 'info',
                        'service_request' => 'primary',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (?string $state): string => $state ? ucfirst(str_replace('_', ' ', $state)) : 'Inquiry')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'warning',
                        'contacted' => 'info',
                        'closed' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\Action::make('whatsapp')
                    ->label('Chat')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('success')
                    ->url(fn ($record) => $record->phone 
                        ? 'https://wa.me/' . preg_replace('/[^0-9]/', '', $record->phone)
                        : null)
                    ->openUrlInNewTab()
                    ->visible(fn ($record) => !empty($record->phone)),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn () => auth()->user()->hasRole('Super Admin')),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
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
            'index' => Pages\ListLeads::route('/'),
            'edit' => Pages\EditLead::route('/{record}/edit'),
        ];
    }
}
