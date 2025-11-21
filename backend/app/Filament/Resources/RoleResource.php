<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoleResource\Pages;
use App\Filament\Resources\RoleResource\RelationManagers;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationLabel = 'Roles & Permissions';

    protected static ?string $navigationGroup = 'System';

    protected static ?int $navigationSort = 998;

    public static function canAccess(): bool
    {
        // Only Super Admin can access roles
        return auth()->user()?->hasRole('Super Admin') ?? false;
    }

    public static function form(Form $form): Form
    {
        // Get all permissions
        $allPermissions = Permission::orderBy('name')->get();

        // Create permission options array
        $permissionOptions = [];
        foreach ($allPermissions as $permission) {
            $permissionOptions[$permission->id] = ucfirst(str_replace('_', ' ', $permission->name));
        }

        return $form
            ->schema([
                Forms\Components\Section::make('Role Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Role Name')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->helperText('Enter a unique role name (e.g., Sales Agent, Manager)'),
                    ])
                    ->columns(1),
                
                Forms\Components\Section::make('Permissions')
                    ->description('Select the permissions for this role. Permissions control what actions users with this role can perform.')
                    ->schema([
                        Forms\Components\CheckboxList::make('permissions')
                            ->label('Available Permissions')
                            ->options($permissionOptions)
                            ->columns(2)
                            ->searchable()
                            ->bulkToggleable()
                            ->gridDirection('row')
                            ->descriptions(function () use ($allPermissions) {
                                $descriptions = [];
                                foreach ($allPermissions as $perm) {
                                    $descriptions[$perm->id] = static::getPermissionDescription($perm->name);
                                }
                                return $descriptions;
                            })
                            ->relationship('permissions', 'name', fn ($query) => $query->orderBy('name'))
                            ->required()
                            ->helperText('Select all permissions that should be granted to users with this role.'),
                    ])
                    ->collapsible()
                    ->columnSpanFull(),
            ]);
    }

    protected static function getPermissionDescription(string $permission): string
    {
        $descriptions = [
            'view' => 'View and browse records',
            'create' => 'Create new records',
            'edit' => 'Modify existing records',
            'delete' => 'Remove records (Super Admin only)',
            'manage' => 'Full management access',
        ];

        $parts = explode(' ', $permission);
        $action = $parts[0] ?? '';
        $resource = $parts[1] ?? '';

        $actionDesc = $descriptions[$action] ?? ucfirst($action);
        $resourceDesc = ucfirst(str_replace('_', ' ', $resource));

        return "{$actionDesc} for {$resourceDesc}";
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Role Name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Super Admin' => 'danger',
                        'Staff' => 'warning',
                        'Tenant' => 'info',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('users_count')
                    ->label('Users')
                    ->counts('users')
                    ->sortable()
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('permissions_count')
                    ->label('Permissions')
                    ->counts('permissions')
                    ->sortable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('permissions.name')
                    ->label('Permission List')
                    ->badge()
                    ->separator(',')
                    ->limit(3)
                    ->limitList(3)
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn ($record) => !in_array($record->name, ['Super Admin', 'Staff', 'Tenant'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->deselectRecordsAfterCompletion(),
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
            'index' => Pages\ListRoles::route('/'),
            'create' => Pages\CreateRole::route('/create'),
            'edit' => Pages\EditRole::route('/{record}/edit'),
        ];
    }
}
