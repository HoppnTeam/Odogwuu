# 🍽️ Hoppn Mobile App Setup Guide

## Supabase Configuration for Mobile App

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `hoppn-african-food`
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to Minnesota (e.g., US East)
5. Click "Create new project"

### 2. Get Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Set Up Environment Variables for Mobile

1. Create a `.env` file in the project root:
```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (for future use)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Mapbox Configuration (for future use)
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Twilio Configuration (for future use)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SendGrid Configuration (for future use)
SENDGRID_API_KEY=your_sendgrid_api_key
```

**Important**: For Expo mobile apps, all environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the client.

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

### 5. Configure Authentication for Mobile

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following:
   - **Site URL**: `exp://localhost:8081` (for Expo development)
   - **Redirect URLs**: 
     - `exp://localhost:8081/*` (for development)
     - `exp://192.168.1.100:8081/*` (for device testing)
     - `hoppn://*` (for production deep linking)
   - **Email Templates**: Customize if needed

3. Enable the authentication providers you want to use:
   - **Email**: Enable email/password authentication
   - **Google**: Optional - for social login
   - **Apple**: Recommended for iOS users

### 6. Set Up Row Level Security (RLS)

The schema already includes RLS policies, but verify they're working:

1. Go to **Authentication** → **Policies**
2. Ensure all tables have the correct policies enabled
3. Test the policies with sample data

## Mobile App Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Expo CLI (if not already installed)

```bash
npm install -g @expo/cli
```

### 3. Start Development Server

```bash
npm run dev
# or
expo start
```

### 4. Test on Device

1. Install **Expo Go** app on your phone
2. Scan the QR code from the terminal
3. The app will load on your device

### 5. Test the Connection

The app will automatically validate the Supabase connection on startup. Check the console for any connection errors.

## Mobile-Specific Features

### Deep Linking Setup

1. Update `app.json` with your app scheme:
```json
{
  "expo": {
    "scheme": "hoppn",
    "ios": {
      "bundleIdentifier": "com.hoppn.africanfood"
    },
    "android": {
      "package": "com.hoppn.africanfood"
    }
  }
}
```

### Location Services

The app includes location-based features for finding nearby African restaurants in Minnesota:

1. **Location Permissions**: The app will request location access
2. **Nearby Vendors**: Uses PostGIS to find restaurants within 10km
3. **Pickup Optimization**: Suggests optimal pickup times based on location

### Push Notifications (Future)

When ready to implement:
1. Configure Expo Push Notifications
2. Set up notification channels for order updates
3. Integrate with Twilio for SMS notifications

## Database Schema Overview

### Tables

1. **users** - Customer profiles and preferences
2. **vendors** - African restaurants (managed via web app)
3. **dishes** - Menu items with cultural context
4. **orders** - Pickup orders with status tracking
5. **reviews** - User reviews for dishes and restaurants

### Key Features

- **Cultural Education**: Every dish includes origin story and cultural significance
- **Spice Level System**: 1-5 chili rating with African spice education
- **Minnesota Tax Calculation**: Automatic tax calculation based on city
- **Location Services**: Nearby vendor search with PostGIS
- **Real-time Updates**: Order status updates via Supabase realtime
- **Offline Support**: Basic offline functionality for browsing

## Testing the Setup

### 1. Test Database Connection

```typescript
import { supabase } from '@/lib/supabase';

// Test connection
const { data, error } = await supabase.from('vendors').select('*').limit(1);
console.log('Connection test:', { data, error });
```

### 2. Test Authentication

```typescript
import { supabase } from '@/lib/supabase';

// Test sign up
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
});
```

### 3. Test Service Layer

```typescript
import { vendorService } from '@/lib/supabase-service';

// Test getting vendors
const vendors = await vendorService.getAllVendors();
console.log('Vendors:', vendors);
```

### 4. Test on Physical Device

1. Make sure your phone and computer are on the same WiFi network
2. Run `expo start` and scan the QR code
3. Test all features on the actual device
4. Check location services work properly

## Mobile Development Best Practices

### Performance

- Use `FlatList` for long lists of dishes/restaurants
- Implement image caching and optimization
- Use `useMemo` and `useCallback` for expensive operations
- Implement proper loading states

### User Experience

- Add haptic feedback for interactions
- Implement smooth animations
- Use proper touch targets (minimum 44px)
- Add pull-to-refresh functionality

### Offline Support

- Cache restaurant and dish data locally
- Allow browsing without internet
- Sync data when connection is restored
- Show offline indicators

## Next Steps

1. **Add Sample Data**: Insert test vendors and dishes
2. **Test Authentication Flow**: Implement login/register screens
3. **Connect Real Data**: Replace mock data with Supabase queries
4. **Add Payment Integration**: Set up Stripe Connect
5. **Implement Notifications**: Add SMS and push notifications
6. **Add Offline Support**: Implement local caching
7. **Test on Multiple Devices**: iOS and Android

## Troubleshooting

### Common Mobile Issues

1. **Connection Errors**: Verify your environment variables are correct
2. **Location Not Working**: Check location permissions in device settings
3. **Deep Links Not Working**: Verify scheme configuration in app.json
4. **Build Errors**: Clear Expo cache with `expo start -c`
5. **Performance Issues**: Use React DevTools and Flipper for debugging

### Getting Help

- Check the [Expo Documentation](https://docs.expo.dev)
- Review the [Supabase Documentation](https://supabase.com/docs)
- Check the [React Native Documentation](https://reactnative.dev)
- Use Expo's built-in debugging tools

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your Supabase usage and costs
- Implement proper error handling in production
- Use certificate pinning for production builds

## Production Deployment

When ready for production:

1. **Build for App Stores**:
   ```bash
   expo build:ios
   expo build:android
   ```

2. **Update Environment Variables** with production values

3. **Configure Production URLs** in Supabase authentication settings

4. **Set up Monitoring** and crash reporting

5. **Test on Multiple Devices** and screen sizes

---

**Remember**: This is a pickup-only service focused on Minnesota. All features should reflect this business model and geographic focus. The mobile app is the primary interface for customers to discover and order African food. 