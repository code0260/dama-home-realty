<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class AIChatInterface extends Widget
{
    protected static string $view = 'filament.widgets.ai-chat-interface';
    
    protected static ?string $heading = 'DamaGenie AI Assistant';
    
    protected static ?int $sort = 21;

    protected int | string | array $columnSpan = 'full';

    public function getViewData(): array
    {
        return [
            'api_endpoint' => url('/api/ai-concierge/chat'),
            'initial_message' => 'Hello! I\'m DamaGenie, your AI assistant. How can I help you with your dashboard today?',
        ];
    }
}

