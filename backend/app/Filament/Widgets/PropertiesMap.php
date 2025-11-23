<?php

namespace App\Filament\Widgets;

use App\Models\Property;
use Filament\Widgets\Widget;

class PropertiesMap extends Widget
{
    protected static string $view = 'filament.widgets.properties-map';
    
    protected static ?string $heading = 'Properties Map';
    
    protected static ?int $sort = 15;

    protected int | string | array $columnSpan = 'full';

    protected int | string | array $columnSpanTablet = 'full';

    protected int | string | array $columnSpanDesktop = 'full';

    public function getViewData(): array
    {
        // Get properties with coordinates (if available)
        $properties = Property::with('neighborhood')
            ->whereNotNull('full_address')
            ->limit(50) // Limit for performance
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->getTranslation('title', 'en') ?? 
                               $property->getTranslation('title', 'ar') ?? 
                               'Unknown',
                    'address' => $property->full_address ?? 'Damascus, Syria',
                    'type' => $property->type,
                    'status' => $property->status,
                    'price' => $property->price,
                    'neighborhood' => $property->neighborhood ? 
                        (is_array($property->neighborhood->name) ? 
                            ($property->neighborhood->name['en'] ?? $property->neighborhood->name['ar'] ?? 'Unknown') : 
                            $property->neighborhood->name) : 'Unknown',
                ];
            });

        return [
            'properties' => $properties,
            'apiEndpoint' => route('api.admin.dashboard.properties.map-data'),
        ];
    }
}

