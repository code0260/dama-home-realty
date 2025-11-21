# Installation Commands for Version 2.0

## Quick Setup Commands

### Backend (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install OpenAI PHP client
composer require openai-php/laravel

# (Optional) Publish OpenAI config
php artisan vendor:publish --provider="OpenAI\Laravel\ServiceProvider"
```

### Frontend (Next.js)

```bash
# Navigate to frontend directory
cd backend/frontend

# Install Google Maps React library
npm install @react-google-maps/api
```

## Environment Variables

### Backend `.env`

Add this line:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Frontend `.env.local`

Create or update `backend/frontend/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing

### Test AI Search

1. Start Laravel server: `php artisan serve`
2. Start Next.js dev server: `npm run dev`
3. Visit homepage
4. Click "Try AI Magic Search" button
5. Type: "cheap flat in Malki with solar power"

### Test Map Search

1. Visit `/map-search`
2. Verify map loads with markers
3. Click on a marker to see property info
4. Test property list on the left side

## Troubleshooting

### If composer command not found:

```bash
# Windows (PowerShell)
php composer.phar require openai-php/laravel

# Or download composer.phar to backend directory first
```

### If npm command not found:

Make sure Node.js is installed and in PATH.

---

**Note:** See `VERSION_2_SETUP.md` for detailed setup instructions.

