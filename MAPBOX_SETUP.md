# Mapbox Integration Setup Guide

## Overview
The Hoppn app now includes Mapbox integration for displaying restaurant locations on an interactive map. This guide will help you set up Mapbox for development and production.

## Prerequisites
- Mapbox account (free tier available)
- Expo development environment

## Step 1: Get Mapbox Access Token

1. Go to [Mapbox](https://www.mapbox.com/) and create an account
2. Navigate to your account dashboard
3. Create a new access token or use the default public token
4. Copy your access token

## Step 2: Configure Environment Variables

1. Create or update your `.env` file in the project root:

```bash
# Existing variables...
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

2. Update `config/env.ts` to include the Mapbox token:

```typescript
export const ENV_CONFIG = {
  // ... existing config
  MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || 'your_mapbox_access_token_here',
};
```

## Step 3: Update app.json Configuration

The `app.json` file has been updated with Mapbox plugin configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "@rnmapbox/maps",
        {
          "mapboxPublicKey": "your_mapbox_public_key_here"
        }
      ]
    ]
  }
}
```

**Important**: Replace `"your_mapbox_public_key_here"` with your actual Mapbox public key.

## Step 4: Platform-Specific Setup

### iOS
1. No additional setup required for iOS
2. The plugin automatically handles iOS configuration

### Android
1. No additional setup required for Android
2. The plugin automatically handles Android configuration

## Step 5: Testing the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to the Restaurants screen
3. Tap the map icon in the header
4. The map should display with:
   - User location (blue dot with ring)
   - Restaurant markers (colored pins)
   - Interactive restaurant selection

## Features Implemented

### Restaurant Map Component (`components/RestaurantMap.tsx`)
- **Interactive Map**: Full-screen Mapbox map
- **User Location**: Blue dot showing current location
- **Restaurant Markers**: Color-coded pins for restaurants
  - 🟢 Green: Very close (≤2km)
  - 🟠 Orange: Standard distance
  - 🔴 Red: Closed restaurants
- **Restaurant Info Panel**: Shows details when a restaurant is selected
- **Navigation Controls**: Center on user location button

### Integration with Location Services
- **Real-time Location**: Updates user location automatically
- **Distance Calculations**: Shows distance from user to restaurants
- **Travel Time Estimates**: Calculates estimated travel time
- **Permission Handling**: Manages location permissions gracefully

### Restaurant Data Integration
- **Location-aware Filtering**: Shows restaurants based on proximity
- **Real-time Updates**: Refreshes when location changes
- **Status Indicators**: Shows open/closed status
- **Pickup Information**: Displays pickup times and travel estimates

## Troubleshooting

### Map Not Loading
1. Check your Mapbox access token is correct
2. Verify the token has the necessary permissions
3. Check network connectivity
4. Review console logs for error messages

### Location Not Working
1. Ensure location permissions are granted
2. Check device location services are enabled
3. Verify the app has location permissions in device settings

### Restaurant Markers Not Showing
1. Check restaurant data has valid coordinates
2. Verify the restaurant service is returning data
3. Check for any console errors

## Production Deployment

### Environment Variables
- Ensure `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` is set in your production environment
- Use a production Mapbox token with appropriate rate limits

### Build Configuration
- The Mapbox plugin is automatically included in builds
- No additional build steps required

### Rate Limits
- Monitor Mapbox usage in your dashboard
- Consider upgrading if you exceed free tier limits
- Implement caching for restaurant data to reduce API calls

## Security Considerations

1. **Public Token**: The Mapbox token used is public and safe for client-side use
2. **Rate Limiting**: Monitor usage to prevent abuse
3. **Data Privacy**: Restaurant locations are public information
4. **User Location**: Only stored locally, not transmitted to servers

## Future Enhancements

- **Directions**: Add navigation directions to restaurants
- **Clustering**: Group nearby restaurants for better UX
- **Custom Styles**: Implement custom map styling
- **Offline Maps**: Add offline map support
- **Real-time Updates**: Show real-time restaurant status changes

## Support

For Mapbox-specific issues:
- [Mapbox Documentation](https://docs.mapbox.com/)
- [Mapbox Support](https://support.mapbox.com/)

For app-specific issues:
- Check the project documentation
- Review the codebase for implementation details 