import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationService, NotificationData } from '@/lib/notification-service';
import { router } from 'expo-router';

interface NotificationContextType {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;
  sendOrderNotification: (orderId: string, status: string, restaurantName: string) => Promise<void>;
  sendCulturalNotification: (dishName: string, country: string, flag: string) => Promise<void>;
  sendNewRestaurantNotification: (restaurantName: string, cuisineType: string, country: string) => Promise<void>;
  sendFeaturedDishNotification: (dishName: string, country: string, flag: string) => Promise<void>;
  sendPromotionalNotification: (discount: string, cuisineType: string) => Promise<void>;
  sendLoyaltyNotification: (countriesTried: number, badgeName: string) => Promise<void>;
  sendSeasonalNotification: (holiday: string, countries: string[]) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Check current permission status
      const { status } = await NotificationService.getNotificationPermissions();
      setHasPermission(status === 'granted');

      // Register for push notifications if permission granted
      if (status === 'granted') {
        await NotificationService.registerForPushNotifications();
      }

      // Set up notification response listener
      const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
      
      return () => subscription.remove();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const handleNotificationResponse = (response: any) => {
    const data = response.notification.request.content.data as NotificationData;
    
    if (!data) return;

    switch (data.type) {
      case 'order_status':
        if (data.orderId) {
          router.push(`/order-tracking?orderId=${data.orderId}`);
        }
        break;
        
      case 'cultural_discovery':
        if (data.country) {
          router.push(`/country/${data.country.toLowerCase()}`);
        }
        break;
        
      case 'new_restaurant':
        if (data.restaurantId) {
          router.push(`/restaurant/${data.restaurantId}`);
        }
        break;
        
      case 'featured_dish':
        if (data.dishId) {
          router.push(`/dish/${data.dishId}`);
        }
        break;
        
      case 'promotional':
        // Navigate to restaurants with promotional filter
        router.push('/(tabs)/restaurants');
        break;
        
      case 'loyalty':
        // Navigate to profile/achievements
        router.push('/(tabs)/profile');
        break;
        
      case 'seasonal':
        // Navigate to seasonal content
        router.push('/');
        break;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await NotificationService.requestNotificationPermissions();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (granted) {
        await NotificationService.registerForPushNotifications();
        Alert.alert(
          'Notifications Enabled! 🎉',
          'You\'ll now receive updates about your orders, cultural discoveries, and special offers.'
        );
      } else {
        Alert.alert(
          'Notifications Disabled',
          'You can enable notifications in your device settings to stay updated with your orders and discover new African cuisine.'
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendTestNotification = async () => {
    try {
      await NotificationService.sendOrderStatusNotification(
        'test-order',
        'confirmed',
        'Test Restaurant'
      );
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const sendOrderNotification = async (orderId: string, status: string, restaurantName: string) => {
    try {
      await NotificationService.sendOrderStatusNotification(
        orderId,
        status as any,
        restaurantName
      );
    } catch (error) {
      console.error('Error sending order notification:', error);
    }
  };

  const sendCulturalNotification = async (dishName: string, country: string, flag: string) => {
    try {
      await NotificationService.sendCulturalNotification(dishName, country, flag);
    } catch (error) {
      console.error('Error sending cultural notification:', error);
    }
  };

  const sendNewRestaurantNotification = async (restaurantName: string, cuisineType: string, country: string) => {
    try {
      await NotificationService.sendNewRestaurantNotification(restaurantName, cuisineType, country);
    } catch (error) {
      console.error('Error sending new restaurant notification:', error);
    }
  };

  const sendFeaturedDishNotification = async (dishName: string, country: string, flag: string) => {
    try {
      await NotificationService.sendFeaturedDishNotification(dishName, country, flag);
    } catch (error) {
      console.error('Error sending featured dish notification:', error);
    }
  };

  const sendPromotionalNotification = async (discount: string, cuisineType: string) => {
    try {
      await NotificationService.sendPromotionalNotification(discount, cuisineType);
    } catch (error) {
      console.error('Error sending promotional notification:', error);
    }
  };

  const sendLoyaltyNotification = async (countriesTried: number, badgeName: string) => {
    try {
      await NotificationService.sendLoyaltyNotification(countriesTried, badgeName);
    } catch (error) {
      console.error('Error sending loyalty notification:', error);
    }
  };

  const sendSeasonalNotification = async (holiday: string, countries: string[]) => {
    try {
      await NotificationService.sendSeasonalNotification(holiday, countries);
    } catch (error) {
      console.error('Error sending seasonal notification:', error);
    }
  };

  const value: NotificationContextType = {
    hasPermission,
    requestPermission,
    sendTestNotification,
    sendOrderNotification,
    sendCulturalNotification,
    sendNewRestaurantNotification,
    sendFeaturedDishNotification,
    sendPromotionalNotification,
    sendLoyaltyNotification,
    sendSeasonalNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 