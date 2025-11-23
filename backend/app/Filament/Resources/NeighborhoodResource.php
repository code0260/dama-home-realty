<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NeighborhoodResource\Pages;
use App\Filament\Resources\NeighborhoodResource\RelationManagers;
use App\Models\Neighborhood;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class NeighborhoodResource extends Resource
{
    protected static ?string $model = Neighborhood::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';
    
    protected static ?string $navigationLabel = 'Neighborhoods';
    
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('English')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.en')
                                            ->label('Name (English)')
                                            ->required(),
                                        Forms\Components\Textarea::make('description.en')
                                            ->label('Description (English)')
                                            ->rows(3),
                                    ]),
                                Forms\Components\Tabs\Tab::make('Arabic')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.ar')
                                            ->label('Name (Arabic)')
                                            ->required()
                                            ->extraAttributes(['dir' => 'rtl']),
                                        Forms\Components\Textarea::make('description.ar')
                                            ->label('Description (Arabic)')
                                            ->rows(3)
                                            ->extraAttributes(['dir' => 'rtl']),
                                    ]),
                            ])
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->unique(ignoreRecord: true)
                            ->helperText('Auto-generated from name if left empty'),
                        Forms\Components\FileUpload::make('image')
                            ->label('Neighborhood Image')
                            ->image()
                            ->directory('neighborhoods')
                            ->visibility('public'),
                        Forms\Components\TextInput::make('city')
                            ->default('Damascus')
                            ->required(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular()
                    ->size(50),
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->formatStateUsing(fn ($record) => $record ? ($record->getTranslation('name', 'en') ?? $record->name ?? 'N/A') : 'N/A')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('city')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('properties_count')
                    ->label('Properties')
                    ->counts('properties')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListNeighborhoods::route('/'),
            'create' => Pages\CreateNeighborhood::route('/create'),
            'edit' => Pages\EditNeighborhood::route('/{record}/edit'),
        ];
    }
}
