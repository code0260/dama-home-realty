<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationLabel = 'Blog Articles';
    
    protected static ?int $navigationSort = 10;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Article Content')
                    ->schema([
                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('English')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.en')
                                            ->label('Title (English)')
                                            ->required()
                                            ->maxLength(255)
                                            ->columnSpanFull(),
                                        Forms\Components\RichEditor::make('content.en')
                                            ->label('Content (English)')
                                            ->required()
                                            ->columnSpanFull()
                                            ->toolbarButtons([
                                                'bold',
                                                'italic',
                                                'underline',
                                                'strike',
                                                'link',
                                                'bulletList',
                                                'orderedList',
                                                'blockquote',
                                                'codeBlock',
                                            ]),
                                    ]),
                                Forms\Components\Tabs\Tab::make('Arabic')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.ar')
                                            ->label('Title (Arabic)')
                                            ->required()
                                            ->maxLength(255)
                                            ->extraAttributes(['dir' => 'rtl'])
                                            ->columnSpanFull(),
                                        Forms\Components\RichEditor::make('content.ar')
                                            ->label('Content (Arabic)')
                                            ->required()
                                            ->extraAttributes(['dir' => 'rtl'])
                                            ->columnSpanFull()
                                            ->toolbarButtons([
                                                'bold',
                                                'italic',
                                                'underline',
                                                'strike',
                                                'link',
                                                'bulletList',
                                                'orderedList',
                                                'blockquote',
                                                'codeBlock',
                                            ]),
                                    ]),
                            ])
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->unique(ignoreRecord: true)
                            ->helperText('Auto-generated from title if left empty')
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('image')
                            ->label('Featured Image')
                            ->image()
                            ->imageEditor()
                            ->directory('articles')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Publishing')
                    ->schema([
                        Forms\Components\Select::make('author_id')
                            ->label('Author')
                            ->relationship('author', 'name')
                            ->default(fn () => auth()->id())
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Published At')
                            ->default(now())
                            ->helperText('Leave empty to save as draft'),
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Article')
                            ->default(false),
                    ])
                    ->columns(3),
                
                Forms\Components\Section::make('Categories & Tags')
                    ->schema([
                        Forms\Components\TagsInput::make('categories')
                            ->label('Categories')
                            ->placeholder('Add category and press Enter')
                            ->suggestions([
                                'Real Estate',
                                'Property Tips',
                                'Market News',
                                'Legal Advice',
                                'Interior Design',
                                'Investment',
                            ])
                            ->default(['Real Estate'])
                            ->columnSpanFull(),
                        Forms\Components\TagsInput::make('tags')
                            ->label('Tags')
                            ->placeholder('Add tag and press Enter')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->circular()
                    ->size(50),
                Tables\Columns\TextColumn::make('title')
                    ->label('Title')
                    ->getStateUsing(fn (Article $record) => $record->getTranslation('title', 'en'))
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('author.name')
                    ->label('Author')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
                Tables\Columns\TextColumn::make('categories')
                    ->label('Categories')
                    ->badge()
                    ->color('primary')
                    ->formatStateUsing(fn ($record) => is_array($record->categories) ? implode(', ', array_slice($record->categories, 0, 2)) : 'Real Estate')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('views')
                    ->label('Views')
                    ->sortable()
                    ->numeric(),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\Filter::make('published')
                    ->query(fn (Builder $query) => $query->whereNotNull('published_at')),
                Tables\Filters\Filter::make('featured')
                    ->query(fn (Builder $query) => $query->where('is_featured', true)),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('published_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }
}
