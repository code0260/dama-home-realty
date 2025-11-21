<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Booking;
use App\Models\Lead;
use App\Models\Neighborhood;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenAI\Laravel\Facades\OpenAI;

class AiConciergeController extends Controller
{
    /**
     * System instruction for the AI concierge.
     */
    private function getSystemInstruction(?string $userName = null, ?string $currentPage = null, ?Property $currentProperty = null): string
    {
        $context = "You are Dama Genie, a Senior Real Estate Consultant for Dama Home Realty, a premium real estate platform serving Syrian expats seeking properties in Damascus.\n\n";
        
        $context .= "Your personality:\n";
        $context .= "- Professional, warm, and helpful\n";
        $context .= "- Concise in responses (2-3 sentences max unless detailed explanation is needed)\n";
        $context .= "- Always try to close the deal (get a booking or tour request)\n";
        $context .= "- Use emojis sparingly (only when appropriate)\n\n";

        if ($userName) {
            $context .= "The user's name is: {$userName}\n";
        }

        if ($currentPage) {
            $context .= "Current page: {$currentPage}\n";
        }

        if ($currentProperty) {
            $context .= "Current property context:\n";
            $context .= "- Title: {$currentProperty->title}\n";
            $context .= "- Reference ID: {$currentProperty->reference_id}\n";
            $context .= "- Type: {$currentProperty->type}\n";
            $context .= "- Price: {$currentProperty->price} {$currentProperty->currency}\n";
            $context .= "- Neighborhood: " . ($currentProperty->neighborhood?->name ?? 'N/A') . "\n";
            $context .= "- Bedrooms: {$currentProperty->bedrooms}\n";
            $context .= "- Bathrooms: {$currentProperty->bathrooms}\n";
        }

        $context .= "\nYou have access to tools that can:\n";
        $context .= "- Check property availability\n";
        $context .= "- Calculate booking prices\n";
        $context .= "- Schedule property tours\n";
        $context .= "- Get agent contact information\n";
        $context .= "- Search for properties\n\n";

        $context .= "Always be proactive in suggesting next steps and closing deals.";

        return $context;
    }

    /**
     * Define tools (functions) for OpenAI.
     */
    private function getTools(): array
    {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'check_availability',
                    'description' => 'Check if a property is available for specific dates. Returns available dates and blocked dates.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'property_id' => [
                                'type' => 'integer',
                                'description' => 'The ID of the property to check availability for',
                            ],
                            'check_in' => [
                                'type' => 'string',
                                'description' => 'Check-in date in YYYY-MM-DD format',
                            ],
                            'check_out' => [
                                'type' => 'string',
                                'description' => 'Check-out date in YYYY-MM-DD format',
                            ],
                        ],
                        'required' => ['property_id', 'check_in', 'check_out'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'calculate_total_price',
                    'description' => 'Calculate the total price for a property booking based on number of nights.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'property_id' => [
                                'type' => 'integer',
                                'description' => 'The ID of the property',
                            ],
                            'nights' => [
                                'type' => 'integer',
                                'description' => 'Number of nights to stay',
                            ],
                        ],
                        'required' => ['property_id', 'nights'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'schedule_tour',
                    'description' => 'Schedule a live video tour request for a property. Creates a lead in the system.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'property_id' => [
                                'type' => 'integer',
                                'description' => 'The ID of the property',
                            ],
                            'user_phone' => [
                                'type' => 'string',
                                'description' => 'User phone number for contact',
                            ],
                            'preferred_date' => [
                                'type' => 'string',
                                'description' => 'Preferred date for the tour in YYYY-MM-DD format',
                            ],
                            'preferred_time' => [
                                'type' => 'string',
                                'description' => 'Preferred time (e.g., "10:00 AM", "2:00 PM")',
                            ],
                        ],
                        'required' => ['property_id', 'user_phone', 'preferred_date'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_agent_contact',
                    'description' => 'Get the contact information (WhatsApp, phone) for the agent assigned to a property.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'property_id' => [
                                'type' => 'integer',
                                'description' => 'The ID of the property',
                            ],
                        ],
                        'required' => ['property_id'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'search_properties',
                    'description' => 'Search for properties based on criteria (type, price range, neighborhood, bedrooms, amenities).',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'type' => [
                                'type' => 'string',
                                'description' => 'Property type: apartment, house, villa, hotel, rent, sale',
                                'enum' => ['apartment', 'house', 'villa', 'hotel', 'rent', 'sale'],
                            ],
                            'min_price' => [
                                'type' => 'number',
                                'description' => 'Minimum price',
                            ],
                            'max_price' => [
                                'type' => 'number',
                                'description' => 'Maximum price',
                            ],
                            'neighborhood' => [
                                'type' => 'string',
                                'description' => 'Neighborhood name (e.g., Malki, Mezzeh)',
                            ],
                            'bedrooms' => [
                                'type' => 'integer',
                                'description' => 'Number of bedrooms',
                            ],
                            'amenities' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                                'description' => 'List of amenities (e.g., wifi, parking, pool)',
                            ],
                        ],
                        'required' => [],
                    ],
                ],
            ],
        ];
    }

    /**
     * Handle chat request from frontend.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'conversation_history' => 'array',
            'current_page' => 'nullable|string',
            'property_slug' => 'nullable|string',
        ]);

        $user = Auth::user();
        $userName = $user ? $user->name : null;
        $currentPage = $request->input('current_page');
        $propertySlug = $request->input('property_slug');
        $conversationHistory = $request->input('conversation_history', []);

        // Get current property if on property page
        $currentProperty = null;
        if ($propertySlug) {
            $currentProperty = Property::where('slug', $propertySlug)
                ->orWhere('uuid', $propertySlug)
                ->with(['neighborhood', 'agent'])
                ->first();
        }

        // Build system instruction with context
        $systemInstruction = $this->getSystemInstruction($userName, $currentPage, $currentProperty);

        // Build messages array
        $messages = [
            ['role' => 'system', 'content' => $systemInstruction],
        ];

        // Add conversation history
        foreach ($conversationHistory as $msg) {
            if (isset($msg['role']) && isset($msg['content'])) {
                $messages[] = [
                    'role' => $msg['role'],
                    'content' => $msg['content'],
                ];
            }
        }

        // Add current user message
        $messages[] = [
            'role' => 'user',
            'content' => $request->input('message'),
        ];

        try {
            // Call OpenAI with function calling
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => $messages,
                'tools' => $this->getTools(),
                'tool_choice' => 'auto',
                'temperature' => 0.7,
            ]);

            $assistantMessage = $response->choices[0]->message;
            $content = $assistantMessage->content;
            $toolCalls = $assistantMessage->toolCalls ?? [];

            // Execute tool calls
            $toolResults = [];
            foreach ($toolCalls as $toolCall) {
                $functionName = $toolCall->function->name;
                $functionArgs = json_decode($toolCall->function->arguments, true);

                try {
                    $result = $this->executeTool($functionName, $functionArgs, $user);
                    $toolResults[] = [
                        'tool_call_id' => $toolCall->id,
                        'role' => 'tool',
                        'name' => $functionName,
                        'content' => json_encode($result),
                    ];
                } catch (\Exception $e) {
                    $toolResults[] = [
                        'tool_call_id' => $toolCall->id,
                        'role' => 'tool',
                        'name' => $functionName,
                        'content' => json_encode(['error' => $e->getMessage()]),
                    ];
                }
            }

            // If there are tool results, get final response
            if (!empty($toolResults)) {
                $messages[] = $assistantMessage->toArray();
                $messages = array_merge($messages, $toolResults);

                $finalResponse = OpenAI::chat()->create([
                    'model' => 'gpt-4o-mini',
                    'messages' => $messages,
                    'temperature' => 0.7,
                ]);

                $content = $finalResponse->choices[0]->message->content;
            }

            return response()->json([
                'message' => $content,
                'tool_calls' => !empty($toolCalls),
            ]);
        } catch (\Exception $e) {
            \Log::error('AI Concierge Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'I apologize, but I encountered an error. Please try again or contact support.',
            ], 500);
        }
    }

    /**
     * Execute a tool function.
     */
    private function executeTool(string $functionName, array $args, $user): array
    {
        switch ($functionName) {
            case 'check_availability':
                return $this->checkAvailability($args);

            case 'calculate_total_price':
                return $this->calculateTotalPrice($args);

            case 'schedule_tour':
                return $this->scheduleTour($args, $user);

            case 'get_agent_contact':
                return $this->getAgentContact($args);

            case 'search_properties':
                return $this->searchProperties($args);

            default:
                throw new \Exception("Unknown function: {$functionName}");
        }
    }

    /**
     * Tool: Check property availability.
     */
    private function checkAvailability(array $args): array
    {
        $property = Property::findOrFail($args['property_id']);
        $checkIn = Carbon::parse($args['check_in']);
        $checkOut = Carbon::parse($args['check_out']);

        $hasOverlap = Booking::hasOverlap($property->id, $checkIn, $checkOut);

        // Get all blocked dates
        $bookings = Booking::where('property_id', $property->id)
            ->where('booking_status', '!=', 'cancelled')
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereBetween('check_in', [$checkIn, $checkOut])
                  ->orWhereBetween('check_out', [$checkIn, $checkOut])
                  ->orWhere(function ($q2) use ($checkIn, $checkOut) {
                      $q2->where('check_in', '<=', $checkIn)
                         ->where('check_out', '>=', $checkOut);
                  });
            })
            ->get();

        $blockedDates = [];
        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->check_in);
            $end = Carbon::parse($booking->check_out);
            $current = $start->copy();
            while ($current < $end) {
                $blockedDates[] = $current->format('Y-m-d');
                $current->addDay();
            }
        }

        return [
            'available' => !$hasOverlap,
            'property_id' => $property->id,
            'property_title' => $property->title,
            'check_in' => $checkIn->format('Y-m-d'),
            'check_out' => $checkOut->format('Y-m-d'),
            'blocked_dates' => array_unique($blockedDates),
            'message' => $hasOverlap 
                ? "Sorry, the property is not available for these dates. Here are the blocked dates: " . implode(', ', array_slice($blockedDates, 0, 5))
                : "Great news! The property is available for these dates.",
        ];
    }

    /**
     * Tool: Calculate total price.
     */
    private function calculateTotalPrice(array $args): array
    {
        $property = Property::findOrFail($args['property_id']);
        $nights = $args['nights'];
        $totalPrice = $property->price * $nights;
        $deposit = $totalPrice * 0.3; // 30% deposit

        return [
            'property_id' => $property->id,
            'property_title' => $property->title,
            'nights' => $nights,
            'price_per_night' => $property->price,
            'currency' => $property->currency,
            'total_price' => $totalPrice,
            'deposit' => $deposit,
            'remaining_balance' => $totalPrice - $deposit,
            'message' => "For {$nights} nights, the total is {$totalPrice} {$property->currency}. A 30% deposit ({$deposit} {$property->currency}) is required to confirm the booking.",
        ];
    }

    /**
     * Tool: Schedule a tour.
     */
    private function scheduleTour(array $args, $user): array
    {
        $property = Property::findOrFail($args['property_id']);
        $userPhone = $args['user_phone'];
        $preferredDate = $args['preferred_date'] ?? null;
        $preferredTime = $args['preferred_time'] ?? 'Flexible';

        $lead = Lead::create([
            'name' => $user ? $user->name : 'Guest',
            'phone' => $userPhone,
            'property_id' => $property->id,
            'type' => 'live_tour_request',
            'status' => 'new',
            'preferred_date' => $preferredDate,
            'preferred_time' => $preferredTime,
            'message' => "Tour request for {$property->title} (Ref: {$property->reference_id})",
        ]);

        return [
            'success' => true,
            'lead_id' => $lead->id,
            'property_title' => $property->title,
            'preferred_date' => $preferredDate,
            'preferred_time' => $preferredTime,
            'message' => "Perfect! I've scheduled your tour request for {$property->title}. Our team will contact you at {$userPhone} to confirm the details.",
        ];
    }

    /**
     * Tool: Get agent contact.
     */
    private function getAgentContact(array $args): array
    {
        $property = Property::with('agent')->findOrFail($args['property_id']);

        if (!$property->agent) {
            return [
                'has_agent' => false,
                'message' => "This property doesn't have an assigned agent. Please use the contact form or call the main office.",
            ];
        }

        $agent = $property->agent;
        $whatsappLink = "https://wa.me/" . preg_replace('/[^0-9]/', '', $agent->phone);

        return [
            'has_agent' => true,
            'agent_name' => $agent->name,
            'agent_phone' => $agent->phone,
            'agent_role' => $agent->role,
            'whatsapp_link' => $whatsappLink,
            'message' => "The assigned agent is {$agent->name} ({$agent->role}). Phone: {$agent->phone}. I can help you contact them via WhatsApp.",
        ];
    }

    /**
     * Tool: Search properties.
     */
    private function searchProperties(array $args): array
    {
        $query = Property::with(['neighborhood', 'agent'])
            ->where('status', 'active');

        if (isset($args['type'])) {
            $query->where('type', $args['type']);
        }

        if (isset($args['min_price'])) {
            $query->where('price', '>=', $args['min_price']);
        }

        if (isset($args['max_price'])) {
            $query->where('price', '<=', $args['max_price']);
        }

        if (isset($args['neighborhood'])) {
            $neighborhood = Neighborhood::where('name->en', 'like', '%' . $args['neighborhood'] . '%')
                ->orWhere('name->ar', 'like', '%' . $args['neighborhood'] . '%')
                ->first();
            
            if ($neighborhood) {
                $query->where('neighborhood_id', $neighborhood->id);
            }
        }

        if (isset($args['bedrooms'])) {
            $bedrooms = (int) $args['bedrooms'];
            if ($bedrooms >= 4) {
                $query->where('bedrooms', '>=', 4);
            } else {
                $query->where('bedrooms', $bedrooms);
            }
        }

        if (isset($args['amenities']) && is_array($args['amenities'])) {
            foreach ($args['amenities'] as $amenity) {
                $query->whereJsonContains('amenities', $amenity);
            }
        }

        $properties = $query->orderBy('is_featured', 'desc')->latest()->limit(10)->get();

        return [
            'count' => $properties->count(),
            'properties' => PropertyResource::collection($properties)->resolve(),
            'message' => "I found {$properties->count()} properties matching your criteria. Here are the top results.",
        ];
    }
}

