# Hoppn - Authentic African Cuisine App

Experience Convenience, Taste Tradition. Hoppn is a premium African food ordering app focused on authentic African cuisine with cultural education.

## Features

- **Authentic African Cuisine**: Discover dishes from across Africa with cultural stories
- **Pickup-Only Service**: Optimized for quick, convenient pickup
- **Cultural Education**: Learn about African heritage through food
- **Real-Time Order Tracking**: Track your order status with HP Order IDs
- **Personalized Experience**: Dietary preferences and spice tolerance settings

## HP Order ID System

Hoppn uses a unique HP Order ID system for easy order tracking:
- **Format**: `HP-YY-XXXXXXX` (e.g., `HP-25-0001234`)
- **HP** = Hoppn prefix
- **25** = Year (2025 → 25)
- **0001234** = 7-digit sequential number

See [HP Order ID Setup Guide](./HP_ORDER_ID_SETUP.md) for implementation details.

## Tech Stack

- **Frontend**: React Native with Expo SDK 53
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: React Context
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind for React Native)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hoppnproject3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env
   # Fill in your Supabase credentials
   ```

4. **Set up Supabase**
   - Run the SQL scripts in `database/complete_fix.sql`
   - Deploy the HP Order ID Edge Function (see setup guide)
   - Configure RLS policies

5. **Start the development server**
   ```bash
   npx expo start
   ```

## Project Structure

```
hoppnproject3/
├── app/                    # Expo Router screens
├── components/             # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Services and utilities
├── types/                 # TypeScript definitions
├── database/              # SQL schemas and migrations
├── supabase/              # Edge Functions
└── assets/                # Images and static files
```

## Key Features Implementation

### Order Management
- Single-restaurant cart enforcement
- Single active order per user
- Real-time order status updates
- HP Order ID generation and tracking

### Cultural Education
- Dish origin stories and cultural context
- African country information and flags
- Spice level education system
- Ingredient explanations with cultural context

### User Experience
- Onboarding flow with preferences
- Personalized recommendations
- Push notifications with HP Order IDs
- Order history with cultural insights

## Development

### Running the App
```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Database Setup
```bash
# Run the complete database setup
psql -h your-supabase-host -U postgres -d postgres -f database/complete_fix.sql
```

### Edge Functions
```bash
# Deploy HP Order ID generation function
supabase functions deploy generate-order-id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Hoppn.

## Support

For support and questions, please contact the development team.
