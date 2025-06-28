import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'reminder' | 'complete';
export type NotificationType = 'order_status' | 'cultural_discovery' | 'new_restaurant' | 'featured_dish' | 'promotional' | 'loyalty' | 'seasonal';

export interface NotificationData {
  type: NotificationType;
  orderId?: string;
  restaurantId?: string;
  dishId?: string;
  country?: string;
  restaurantName?: string;
  dishName?: string;
  estimatedTime?: number;
  cuisineType?: string;
  discount?: string;
  countriesTried?: number;
  badgeName?: string;
  holiday?: string;
  countries?: string[];
  [key: string]: unknown;
}

export class NotificationService {
  
  /**
   * Register device for push notifications
   */
  static async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;
    
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return null;
      }
      
      try {
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })).data;
        
        // Save token to Supabase
        await this.saveTokenToDatabase(token);
        
        console.log('Push token:', token);
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }
    
    return token;
  }
  
  /**
   * Save push token to Supabase database
   */
  private static async saveTokenToDatabase(token: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('user_notification_tokens')
          .upsert({
            user_id: user.id,
            expo_push_token: token,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error saving token to database:', error);
    }
  }
  
  /**
   * Send order status notification
   */
  static async sendOrderStatusNotification(
    orderId: string, 
    status: OrderStatus, 
    restaurantName: string,
    estimatedTime?: number
  ) {
    const messages = {
      confirmed: {
        title: "Order Confirmed! 🎉",
        body: `Your order from ${restaurantName} is confirmed! Pickup in ${estimatedTime || 25} minutes.`
      },
      preparing: {
        title: "Kitchen is Cooking! 👨‍🍳",
        body: `Your authentic African dishes are being prepared with love at ${restaurantName}`
      },
      ready: {
        title: "Order Ready for Pickup! 🍽️",
        body: `Your delicious order is ready at ${restaurantName}. Bon appétit!`
      },
      reminder: {
        title: "Pickup Reminder ⏰",
        body: `Don't forget - your order at ${restaurantName} expires in 15 minutes`
      },
      complete: {
        title: "Thanks for choosing Hoppn! 🌍",
        body: `Rate your experience with ${restaurantName} and help others discover authentic African cuisine`
      }
    };
    
    await this.sendLocalNotification(
      messages[status].title,
      messages[status].body,
      { 
        type: 'order_status', 
        orderId, 
        restaurantName,
        estimatedTime 
      }
    );
  }
  
  /**
   * Send cultural discovery notification
   */
  static async sendCulturalNotification(dishName: string, country: string, flag: string) {
    await this.sendLocalNotification(
      `Discover ${country} Cuisine ${flag}`,
      `Learn the fascinating story behind ${dishName} and its cultural significance`,
      { 
        type: 'cultural_discovery', 
        country,
        dishName 
      }
    );
  }
  
  /**
   * Send new restaurant notification
   */
  static async sendNewRestaurantNotification(restaurantName: string, cuisineType: string, country: string) {
    await this.sendLocalNotification(
      "New African Restaurant Near You! 🆕",
      `Discover ${restaurantName} serving authentic ${cuisineType} cuisine from ${country}`,
      { 
        type: 'new_restaurant', 
        restaurantName,
        cuisineType,
        country 
      }
    );
  }
  
  /**
   * Send featured dish notification
   */
  static async sendFeaturedDishNotification(dishName: string, country: string, flag: string) {
    await this.sendLocalNotification(
      `Today's Featured Dish ${flag}`,
      `Try today's featured dish: ${dishName} from ${country}`,
      { 
        type: 'featured_dish', 
        dishName,
        country 
      }
    );
  }
  
  /**
   * Send promotional notification
   */
  static async sendPromotionalNotification(discount: string, cuisineType: string) {
    await this.sendLocalNotification(
      "Special Offer Just for You! 🎁",
      `${discount} off your next ${cuisineType} dish order`,
      { 
        type: 'promotional', 
        discount,
        cuisineType 
      }
    );
  }
  
  /**
   * Send loyalty achievement notification
   */
  static async sendLoyaltyNotification(countriesTried: number, badgeName: string) {
    await this.sendLocalNotification(
      "Achievement Unlocked! 🏆",
      `You've tried ${countriesTried} countries! Unlock your ${badgeName} badge`,
      { 
        type: 'loyalty', 
        countriesTried,
        badgeName 
      }
    );
  }
  
  /**
   * Send seasonal/holiday notification
   */
  static async sendSeasonalNotification(holiday: string, countries: string[]) {
    await this.sendLocalNotification(
      `Celebrate ${holiday}! 🌟`,
      `Discover traditional dishes from ${countries.length} African countries`,
      { 
        type: 'seasonal', 
        holiday,
        countries 
      }
    );
  }
  
  /**
   * Send local notification
   */
  private static async sendLocalNotification(
    title: string, 
    body: string, 
    data?: NotificationData
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data as Record<string, unknown>,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }
  
  /**
   * Schedule notification for later
   */
  static async scheduleNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: NotificationData
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data as Record<string, unknown>,
          sound: true,
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }
  
  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  
  /**
   * Cancel specific notification by ID
   */
  static async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
  
  /**
   * Get notification permissions status
   */
  static async getNotificationPermissions() {
    return await Notifications.getPermissionsAsync();
  }
  
  /**
   * Request notification permissions
   */
  static async requestNotificationPermissions() {
    return await Notifications.requestPermissionsAsync();
  }
  
  /**
   * Get all scheduled notifications
   */
  static async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
  
  /**
   * Set notification badge count
   */
  static async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }
  
  /**
   * Get current badge count
   */
  static async getBadgeCount() {
    return await Notifications.getBadgeCountAsync();
  }
} 