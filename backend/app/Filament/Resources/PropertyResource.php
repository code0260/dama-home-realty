<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PropertyResource\Pages;
use App\Filament\Resources\PropertyResource\RelationManagers;
use App\Models\Property;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Html;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;

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
                                            ->extraAttributes(['dir' => 'rtl']),
                                        Forms\Components\Textarea::make('description.ar')
                                            ->label('Description (Arabic)')
                                            ->required()
                                            ->rows(4)
                                            ->extraAttributes(['dir' => 'rtl']),
                                    ]),
                            ])
                            ->columnSpanFull(),
                        Forms\Components\Select::make('neighborhood_id')
                            ->label('Neighborhood')
                            ->relationship('neighborhood', 'name', fn ($query) => $query->where('city', 'Damascus'))
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record ? ($record->getTranslation('name', 'en') ?? $record->name ?? 'N/A') : 'N/A')
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
                        Forms\Components\FileUpload::make('floor_plans')
                            ->label('Floor Plans')
                            ->image()
                            ->multiple()
                            ->maxFiles(5)
                            ->directory('properties/floor-plans')
                            ->visibility('public')
                            ->helperText('Upload floor plan images'),
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
                        Forms\Components\TextInput::make('owner_name')
                            ->label('Owner Name')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('owner_email')
                            ->label('Owner Email')
                            ->email()
                            ->maxLength(255),
                        Forms\Components\Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'pending' => 'Pending Review',
                                'draft' => 'Draft',
                                'sold' => 'Sold',
                                'rented' => 'Rented',
                            ])
                            ->default('pending')
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
                    ->formatStateUsing(fn ($record) => $record ? ($record->getTranslation('title', 'en') ?? $record->title ?? 'N/A') : 'N/A')
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
                        if (!$record || !isset($record->price)) {
                            return 'N/A';
                        }
                        $currency = ($record->currency ?? 'USD') === 'USD' ? '$' : 'SYP';
                        return $currency . number_format($record->price ?? 0, 2);
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
                        'pending' => 'warning',
                        'draft' => 'gray',
                        'sold' => 'danger',
                        'rented' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'active' => 'Active',
                        'pending' => 'Pending Review',
                        'draft' => 'Draft',
                        'sold' => 'Sold',
                        'rented' => 'Rented',
                        default => ucfirst($state),
                    })
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
                Tables\Columns\TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('owner_name')
                    ->label('Owner')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'active' => 'Active',
                        'pending' => 'Pending Review',
                        'draft' => 'Draft',
                        'sold' => 'Sold',
                        'rented' => 'Rented',
                    ]),
                Tables\Filters\SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'rent' => 'Rent',
                        'sale' => 'Sale',
                        'hotel' => 'Hotel',
                    ]),
                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Verified')
                    ->placeholder('All')
                    ->trueLabel('Verified only')
                    ->falseLabel('Not verified only'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured')
                    ->placeholder('All')
                    ->trueLabel('Featured only')
                    ->falseLabel('Not featured only'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Property $record) {
                        $record->update(['status' => 'active']);
                    })
                    ->visible(fn (Property $record) => $record->status === 'pending')
                    ->successNotificationTitle('Property approved successfully'),
                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (Property $record) {
                        $record->update(['status' => 'draft']);
                    })
                    ->visible(fn (Property $record) => $record->status === 'pending')
                    ->successNotificationTitle('Property rejected'),
                Tables\Actions\Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Property $record) => config('app.frontend_url', url('/')) . '/properties/' . $record->slug)
                    ->openUrlInNewTab(),
                Tables\Actions\Action::make('analytics')
                    ->label('Analytics')
                    ->icon('heroicon-o-chart-bar')
                    ->color('info')
                    ->modalHeading(fn (Property $record) => 'Property Analytics: ' . ($record->getTranslation('title', 'en') ?? $record->title ?? 'N/A'))
                    ->modalContent(function (Property $record) {
                        $views = $record->views ?? 0;
                        $bookingsCount = $record->bookings()->count();
                        $leadsCount = $record->leads()->count();
                        
                        return Html::html(
                            '<div class="space-y-4 p-4">
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="bg-blue-50 p-4 rounded-lg">
                                        <div class="text-sm text-gray-600">Total Views</div>
                                        <div class="text-2xl font-bold text-blue-600">' . number_format($views) . '</div>
                                    </div>
                                    <div class="bg-green-50 p-4 rounded-lg">
                                        <div class="text-sm text-gray-600">Bookings</div>
                                        <div class="text-2xl font-bold text-green-600">' . $bookingsCount . '</div>
                                    </div>
                                    <div class="bg-purple-50 p-4 rounded-lg">
                                        <div class="text-sm text-gray-600">Leads</div>
                                        <div class="text-2xl font-bold text-purple-600">' . $leadsCount . '</div>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-500">
                                    <strong>Status:</strong> ' . ucfirst($record->status) . '<br>
                                    <strong>Created:</strong> ' . $record->created_at->format('M d, Y') . '<br>
                                    <strong>Last Updated:</strong> ' . $record->updated_at->format('M d, Y') . '
                                </div>
                            </div>'
                        );
                    })
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Close'),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn () => auth()->user()->hasRole('Super Admin')),
            ])
            ->headerActions([
                ExportAction::make()
                    ->label('Export to Excel')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each->update(['status' => 'active']);
                        })
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('reject')
                        ->label('Reject Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each->update(['status' => 'draft']);
                        })
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('mark_featured')
                        ->label('Mark as Featured')
                        ->icon('heroicon-o-star')
                        ->color('warning')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each->update(['is_featured' => true]);
                        })
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('unmark_featured')
                        ->label('Unmark as Featured')
                        ->icon('heroicon-o-star')
                        ->color('gray')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each->update(['is_featured' => false]);
                        })
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('verify')
                        ->label('Verify Selected')
                        ->icon('heroicon-o-check-badge')
                        ->color('success')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $records->each->update(['is_verified' => true]);
                        })
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\DeleteBulkAction::make()
                        ->visible(fn () => auth()->user()->hasRole('Super Admin')),
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
