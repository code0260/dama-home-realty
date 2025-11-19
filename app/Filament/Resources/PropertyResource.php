<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PropertyResource\Pages;
use App\Filament\Resources\PropertyResource\RelationManagers;
use App\Models\Property;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PropertyResource extends Resource
{
    protected static ?string $model = Property::class;

    protected static ?string $navigationIcon = 'heroicon-o-home-modern';
    
    protected static ?string $navigationLabel = 'Properties';
    
    protected static ?int $navigationSort = 1;

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
                                        Forms\Components\TextInput::make('title.en')
                                            ->label('Title (English)')
                                            ->required()
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('description.en')
                                            ->label('Description (English)')
                                            ->required()
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('Arabic')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.ar')
                                            ->label('Title (Arabic)')
                                            ->required()
                                            ->maxLength(255)
                                            ->dir('rtl'),
                                        Forms\Components\Textarea::make('description.ar')
                                            ->label('Description (Arabic)')
                                            ->required()
                                            ->rows(4)
                                            ->dir('rtl'),
                                    ]),
                            ])
                            ->columnSpanFull(),
                        Forms\Components\Select::make('neighborhood_id')
                            ->label('Neighborhood')
                            ->relationship('neighborhood', 'name', fn ($query) => $query->where('city', 'Damascus'))
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->getTranslation('name', 'en'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('agent_id')
                            ->label('Agent')
                            ->relationship('agent', 'name')
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('reference_id')
                            ->label('Reference ID')
                            ->unique(ignoreRecord: true)
                            ->helperText('Auto-generated if left empty (e.g., REF-0001)'),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->unique(ignoreRecord: true)
                            ->helperText('Auto-generated from title if left empty'),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Property Details')
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->options([
                                'rent' => 'Rent',
                                'sale' => 'Sale',
                                'hotel' => 'Hotel',
                            ])
                            ->required(),
                        Forms\Components\Select::make('currency')
                            ->options([
                                'USD' => 'USD',
                                'SYP' => 'SYP',
                            ])
                            ->default('USD')
                            ->required(),
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix(fn ($get) => $get('currency') === 'USD' ? '$' : 'SYP')
                            ->suffix(fn ($get) => $get('currency') === 'SYP' ? ' SYP' : ''),
                        Forms\Components\TextInput::make('area_sqm')
                            ->label('Area (sqm)')
                            ->required()
                            ->numeric()
                            ->suffix(' sqm'),
                        Forms\Components\TextInput::make('bedrooms')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('bathrooms')
                            ->required()
                            ->numeric()
                            ->minValue(0),
                    ])
                    ->columns(3),
                
                Forms\Components\Section::make('Media & Verification')
                    ->schema([
                        Forms\Components\FileUpload::make('images')
                            ->label('Property Images')
                            ->image()
                            ->imageEditor()
                            ->optimize('webp')
                            ->multiple()
                            ->maxFiles(10)
                            ->directory('properties')
                            ->visibility('public')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('video_url')
                            ->label('Video URL')
                            ->url()
                            ->placeholder('YouTube or Vimeo URL')
                            ->helperText('Enter full URL for property tour video'),
                        Forms\Components\Toggle::make('is_verified')
                            ->label('Verified Property')
                            ->default(false),
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Property')
                            ->default(false),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Tenant Details (Private Information)')
                    ->schema([
                        Forms\Components\TextInput::make('wifi_password')
                            ->label('WiFi Password')
                            ->helperText('Only visible to tenants with active bookings'),
                        Forms\Components\TextInput::make('door_code')
                            ->label('Door Code / Access Code')
                            ->helperText('Entry code for the property'),
                        Forms\Components\Textarea::make('house_rules')
                            ->label('House Rules')
                            ->rows(4)
                            ->helperText('Rules and guidelines for tenants'),
                        Forms\Components\Textarea::make('full_address')
                            ->label('Full Address')
                            ->rows(3)
                            ->helperText('Complete address (only visible to tenants)'),
                    ])
                    ->columns(2)
                    ->collapsible(),
                
                Forms\Components\Section::make('Additional Information')
                    ->schema([
                        Forms\Components\TagsInput::make('amenities')
                            ->label('Amenities')
                            ->placeholder('Add amenity and press Enter')
                            ->suggestions([
                                'Solar Power 24/7',
                                'WiFi',
                                'Elevator',
                                'Parking',
                                'Generator',
                                'Air Conditioning',
                                'Furnished',
                                'Balcony',
                                'Garden',
                                'Security',
                            ])
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('owner_contact')
                            ->label('Owner Contact')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Phone number or email'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'sold' => 'Sold',
                                'rented' => 'Rented',
                            ])
                            ->default('active')
                            ->required(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('images')
                    ->label('Image')
                    ->circular()
                    ->size(50)
                    ->getStateUsing(function ($record) {
                        $images = $record->images ?? [];
                        return !empty($images) ? $images[0] : null;
                    }),
                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->formatStateUsing(fn ($record) => $record->getTranslation('title', 'en'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(30),
                Tables\Columns\TextColumn::make('reference_id')
                    ->label('Ref ID')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('neighborhood.name')
                    ->label('Neighborhood')
                    ->formatStateUsing(fn ($record) => $record->neighborhood 
                        ? $record->neighborhood->getTranslation('name', 'en')
                        : 'N/A')
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-m-map-pin')
                    ->color('gray'),
                Tables\Columns\TextColumn::make('agent.name')
                    ->label('Agent')
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-m-user')
                    ->color('info')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->formatStateUsing(function ($record) {
                        $currency = $record->currency === 'USD' ? '$' : 'SYP';
                        return $currency . number_format($record->price, 2);
                    })
                    ->sortable()
                    ->color('success'),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'rent' => 'primary',
                        'sale' => 'success',
                        'hotel' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'sold' => 'danger',
                        'rented' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_verified')
                    ->label('Verified')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-badge')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->sortable(),
                Tables\Columns\TextColumn::make('bedrooms')
                    ->label('Beds')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('bathrooms')
                    ->label('Baths')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('area_sqm')
                    ->label('Area')
                    ->suffix(' sqm')
                    ->numeric()
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
            'index' => Pages\ListProperties::route('/'),
            'create' => Pages\CreateProperty::route('/create'),
            'edit' => Pages\EditProperty::route('/{record}/edit'),
        ];
    }
}
