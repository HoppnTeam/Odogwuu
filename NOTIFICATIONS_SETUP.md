# Hoppn Notification System Setup Guide

## Overview
The Hoppn app now includes a comprehensive in-app notification system using Expo Notifications. This system provides real-time updates for orders, cultural content, and user engagement features.

## Features Implemented

### 🔔 Notification Types

#### **Order Flow Notifications**
- **Order Confirmed**: "Your order from [Restaurant] is confirmed! Pickup in 25 minutes."
- **Order Preparing**: "Your Jollof Rice is being prepared with love at [Restaurant]"
- **Order Ready**: "🍽️ Your order is ready for pickup at [Restaurant]!"
- **Pickup Reminder**: "Don't forget - your order expires in 15 minutes"
- **Order Complete**: "Thanks for choosing Hoppn! Rate your experience"

#### **Discovery & Engagement**
- **New Restaurant**: "New African restaurant near you: [Name] serving authentic [Country] cuisine"
- **Featured Dish**: "Try today's featured dish: [Dish] from [Country] 🇳🇬"
- **Cultural Content**: "Learn the story behind Injera - Ethiopia's ancient bread"
- **Weekly Summary**: "This week you explored 3 new countries! 🌍"

#### **Business Notifications**
- **Promotional**: "15% off your next West African dish order"
- **Loyalty**: "You've tried 10 countries! Unlock your Explorer badge 🏆"
- **Seasonal**: "Celebrate Kwanzaa with traditional dishes from 7 African countries"

## Technical Implementation

### 📦 Packages Installed
```bash
npx expo install expo-notifications expo-device expo-constants
npm install --save-dev @expo/cli
```

### 🏗️ Architecture

#### **1. Notification Service** (`lib/notification-service.ts`)
- Core notification functionality
- Push token management
- Local notification sending
- Database integration

#### **2. Notification Context** (`contexts/NotificationContext.tsx`)
- Global notification state management
- Permission handling
- Notification response routing
- Easy-to-use hooks

#### **3. Database Schema** (`database/notification_schema.sql`)
- User notification tokens
- Notification preferences
- Notification history
- Templates and analytics

#### **4. Test Component** (`components/NotificationTest.tsx`)
- Interactive testing interface
- All notification types
- Permission management
- User feedback

## Setup Instructions

### **Step 1: Environment Configuration**

1. **Update app.json** (already done):
```json
{
  "expo": {
    "plugins": [
      "expo-notifications"
    ]
  }
}
```

2. **Environment Variables** (optional for now):
```bash
# Add to .env file when ready for production
EXPO_PUBLIC_NOTIFICATION_ENABLED=true
```

### **Step 2: Database Setup**

Run the notification schema in your Supabase database:
```sql
-- Execute the contents of database/notification_schema.sql
```

### **Step 3: Testing the System**

1. **Start the app**:
```bash
npm start
```

2. **Navigate to Profile Screen**:
   - Go to the Profile tab
   - Find the "Notifications" section
   - Tap "Show Notification Test"

3. **Test Notifications**:
   - Grant permissions when prompted
   - Tap different test buttons
   - Check device notifications
   - Test notification navigation

## Usage Examples

### **Sending Order Notifications**
```typescript
import { useNotifications } from '@/contexts/NotificationContext';

const { sendOrderNotification } = useNotifications();

// When order is confirmed
await sendOrderNotification('order-123', 'confirmed', 'Nigerian Delights');

// When order is ready
await sendOrderNotification('order-123', 'ready', 'Nigerian Delights');
```

### **Sending Cultural Notifications**
```typescript
const { sendCulturalNotification } = useNotifications();

await sendCulturalNotification('Jollof Rice', 'Nigeria', '🇳🇬');
```

### **Sending Promotional Notifications**
```typescript
const { sendPromotionalNotification } = useNotifications();

await sendPromotionalNotification('15% off', 'West African');
```

## Integration Points

### **Order Flow Integration**
- **Checkout Screen**: Send order confirmation
- **Order Tracking**: Send status updates
- **Restaurant Service**: Send pickup reminders

### **Discovery Integration**
- **Restaurant Service**: Send new restaurant alerts
- **Dish Service**: Send featured dish notifications
- **Cultural Content**: Send educational notifications

### **User Engagement**
- **Profile Screen**: Send loyalty achievements
- **Analytics**: Send weekly summaries
- **Seasonal Events**: Send holiday promotions

## Database Tables

### **user_notification_tokens**
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to users)
- expo_push_token: text
- device_type: text (ios/android/web)
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp
```

### **user_notification_preferences**
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to users)
- order_updates: boolean
- cultural_content: boolean
- promotional: boolean
- pickup_reminders: boolean
- new_restaurants: boolean
- featured_dishes: boolean
- loyalty_achievements: boolean
- seasonal_content: boolean
```

### **notification_history**
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to users)
- notification_type: text
- title: text
- body: text
- data: jsonb
- sent_at: timestamp
- delivered: boolean
- opened: boolean
- opened_at: timestamp
```

## Security & Privacy

### **Row Level Security (RLS)**
- All notification tables have RLS enabled
- Users can only access their own data
- Secure token storage and management

### **Permission Management**
- Explicit permission requests
- Graceful handling of denied permissions
- User-controlled notification preferences

### **Data Privacy**
- Notification tokens stored securely
- User preferences respected
- No sensitive data in notifications

## Testing & Debugging

### **Test Component Features**
- ✅ Permission status display
- ✅ All notification types
- ✅ Interactive testing
- ✅ User feedback
- ✅ Navigation testing

### **Debug Information**
- Console logs for token generation
- Error handling for failed notifications
- Permission status tracking
- Database operation logging

## Production Considerations

### **Rate Limiting**
- Monitor notification frequency
- Respect user preferences
- Implement cooldown periods

### **Analytics**
- Track notification delivery rates
- Monitor user engagement
- Analyze notification effectiveness

### **Performance**
- Efficient token management
- Background notification processing
- Minimal battery impact

## Future Enhancements

### **Scheduled Notifications**
- Pickup reminders
- Weekly summaries
- Seasonal promotions

### **Rich Notifications**
- Images and media
- Action buttons
- Deep linking

### **Advanced Features**
- Notification categories
- Smart timing
- A/B testing
- Personalization

## Troubleshooting

### **Common Issues**

1. **Notifications not showing**:
   - Check device permissions
   - Verify notification settings
   - Test on physical device

2. **Permission denied**:
   - Guide user to device settings
   - Provide clear instructions
   - Offer alternative communication

3. **Database errors**:
   - Check Supabase connection
   - Verify RLS policies
   - Review table structure

### **Debug Commands**
```bash
# Check notification permissions
npx expo notifications:permissions

# Test push notifications
npx expo notifications:test

# View notification logs
npx expo logs
```

## Support

For notification-specific issues:
- Check Expo Notifications documentation
- Review console logs for errors
- Test with the NotificationTest component
- Verify database connectivity

For app-specific issues:
- Review the notification context
- Check integration points
- Verify user authentication
- Test notification routing

---

**Note**: This notification system is designed to enhance user engagement while respecting privacy and preferences. All notifications are opt-in and users have full control over their notification settings. 