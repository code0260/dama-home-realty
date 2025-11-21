# Dama Genie - AI Concierge Guide

## Overview

Dama Genie is a global AI-powered real estate concierge that appears on every page of the platform. It's not just a chatbot—it's an **action-oriented assistant** that can execute real tasks using OpenAI Function Calling.

## Features

### 1. Context Awareness
- **User Context**: Knows the user's name if logged in
- **Page Context**: Understands which page the user is on
- **Property Context**: If on a property details page, knows the property details (title, price, neighborhood, etc.)

### 2. Available Tools (Functions)

Dama Genie can execute these actions:

#### `check_availability(property_id, dates)`
- Checks if a property is available for specific dates
- Returns blocked dates and availability status
- Example: "Is this property available from March 1-5?"

#### `calculate_total_price(property_id, nights)`
- Calculates total booking price
- Shows deposit (30%) and remaining balance
- Example: "How much for 3 nights?"

#### `schedule_tour(property_id, user_phone, date)`
- Creates a live tour request (Lead in database)
- Requires phone number
- Example: "I want to book a tour"

#### `get_agent_contact(property_id)`
- Returns agent's WhatsApp and phone number
- Example: "How can I contact the agent?"

#### `search_properties(criteria)`
- Searches properties based on filters
- Supports: type, price range, neighborhood, bedrooms, amenities
- Example: "Find cheap apartments in Malki"

### 3. UI/UX Features

- **Floating Button**: Bottom-right corner with Sparkles icon
- **Glassmorphism Design**: Premium blur effect on chat window
- **Typing Indicator**: Shows "Dama Genie is thinking..." while processing
- **Suggested Chips**: Context-aware quick actions
  - On Property Page: "Is this available?", "Book a tour", "Contact agent"
  - On Homepage: "Find apartments", "Show cheap properties"

## Usage Examples

### Example 1: Check Availability
**User**: "Is this property available from March 1 to March 5?"

**Dama Genie**:
- Calls `check_availability` tool
- Returns: "Great news! The property is available for these dates."

### Example 2: Calculate Price
**User**: "How much would it cost for 3 nights?"

**Dama Genie**:
- Calls `calculate_total_price` tool
- Returns: "For 3 nights, the total is 450 USD. A 30% deposit (135 USD) is required."

### Example 3: Schedule Tour
**User**: "I want to book a tour for tomorrow at 2 PM"

**Dama Genie**:
- Asks for phone number if not provided
- Calls `schedule_tour` tool
- Creates Lead in database
- Returns: "Perfect! I've scheduled your tour request. Our team will contact you..."

### Example 4: Search Properties
**User**: "Find me a cheap 2 bedroom apartment in Malki"

**Dama Genie**:
- Calls `search_properties` tool
- Returns list of matching properties
- Provides links to property details

## System Personality

Dama Genie acts as a **Senior Real Estate Consultant** with:
- **Tone**: Professional, warm, helpful, concise
- **Goal**: Always try to close the deal (get booking or tour request)
- **Style**: 2-3 sentences max unless detailed explanation needed
- **Emojis**: Used sparingly and appropriately

## Technical Details

### Backend
- **Controller**: `App\Http\Controllers\Api\AiConciergeController`
- **Endpoint**: `POST /api/ai-concierge/chat`
- **Model**: GPT-4o-mini (cost-efficient)
- **Authentication**: Optional (works for guests and logged-in users)

### Frontend
- **Component**: `components/ai/DamaGenie.tsx`
- **Location**: Added to `app/layout.tsx` (appears on all pages)
- **State Management**: React hooks (useState, useEffect)
- **API Client**: Uses axiosInstance from `lib/axios.ts`

## Configuration

### Required Environment Variables

**Backend `.env`**:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### API Request Format

```json
{
  "message": "Is this property available?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help you?"
    }
  ],
  "current_page": "/properties/luxury-apartment-malki",
  "property_slug": "luxury-apartment-malki"
}
```

### API Response Format

```json
{
  "message": "Great news! The property is available for these dates.",
  "tool_calls": true
}
```

## Best Practices

1. **Keep Conversations Short**: Dama Genie is designed for quick, actionable interactions
2. **Use Suggested Chips**: Encourage users to use context-aware suggestions
3. **Close the Deal**: Always guide users toward booking or tour requests
4. **Handle Errors Gracefully**: Show friendly error messages if API calls fail

## Troubleshooting

### Genie Not Appearing
- Check if component is added to `layout.tsx`
- Verify no CSS conflicts (z-index, positioning)

### Tool Calls Not Working
- Verify OpenAI API key is set
- Check Laravel logs: `storage/logs/laravel.log`
- Ensure property IDs are valid

### Context Not Working
- Verify `current_page` and `property_slug` are sent in request
- Check if property exists in database

---

**Version**: 2.0.0  
**Last Updated**: 2025-01-19

