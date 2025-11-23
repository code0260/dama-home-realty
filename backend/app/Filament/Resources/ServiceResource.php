<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Services';
    protected static ?int $navigationSort = 6;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Service Information')
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
                                            ->rows(4)
                                            ->extraAttributes(['dir' => 'rtl']),
                                    ]),
                            ])
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('icon')
                            ->label('Icon')
                            ->placeholder('heroicon-o-home or icon name')
                            ->helperText('Icon identifier (e.g., heroicon-o-home)'),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->unique(ignoreRecord: true)
                            ->helperText('Auto-generated from title if left empty'),
                        Forms\Components\FileUpload::make('image')
                            ->label('Service Image')
                            ->image()
                            ->directory('services')
                            ->visibility('public'),
                        Forms\Components\TextInput::make('price')
                            ->label('Price')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\Select::make('currency')
                            ->options([
                                'USD' => 'USD',
                                'SYP' => 'SYP',
                            ])
                            ->default('USD'),
                        Forms\Components\TextInput::make('duration')
                            ->label('Duration')
                            ->placeholder('e.g., 2 hours, 1 day'),
                        Forms\Components\TextInput::make('category')
                            ->label('Category')
                            ->placeholder('e.g., Legal, Maintenance'),
                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sort Order')
                            ->numeric()
                            ->default(0),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true)
                            ->label('Active'),
                        Forms\Components\Toggle::make('is_featured')
                            ->default(false)
                            ->label('Featured'),
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
                Tables\Columns\TextColumn::make('title')
                    ->formatStateUsing(fn ($record) => $record->getTranslation('title', 'en'))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->searchable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('price')
                    ->formatStateUsing(fn ($record) => $record->price ? ($record->currency === 'USD' ? '$' : '') . number_format($record->price, 2) . ($record->currency === 'SYP' ? ' SYP' : '') : 'N/A')
                    ->sortable(),
                Tables\Columns\TextColumn::make('duration')
                    ->label('Duration'),
                Tables\Columns\TextColumn::make('icon')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
                Tables\Filters\SelectFilter::make('category')
                    ->label('Category')
                    ->options(function () {
                        return Service::whereNotNull('category')
                            ->distinct()
                            ->pluck('category', 'category')
                            ->toArray();
                    }),
            ])
            ->actions([
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
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
