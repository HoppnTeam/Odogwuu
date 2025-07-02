/**
 * Analytics Service for Hoppn
 * 
 * Comprehensive user behavior tracking and analytics for the Hoppn app.
 * Provides insights for admin dashboard and user experience optimization.
 */

import { supabase } from './supabase';
import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Types for analytics
export interface UserEvent {
  eventType: string;
  eventCategory: string;
  eventName: string;
  eventData?: Record<string, any>;
  screenName?: string;
  screenSection?: string;
  elementId?: string;
  elementType?: string;
  elementText?: string;
  interactionMethod?: 'tap' | 'swipe' | 'scroll' | 'type' | 'voice' | 'keyboard';
}

export interface UserSession {
  sessionId: string;
  deviceType: 'ios' | 'android' | 'web';
  appVersion?: string;
  osVersion?: string;
  deviceModel?: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
}

export interface ContentInteraction {
  contentType: 'dish' | 'restaurant' | 'country' | 'cultural_story' | 'ingredient' | 'review';
  contentId?: string;
  interactionType: 'view' | 'like' | 'share' | 'bookmark' | 'read' | 'watch' | 'listen';
  interactionDuration?: number;
  interactionDepth?: 'shallow' | 'moderate' | 'deep';
  contentRating?: number;
  feedbackData?: Record<string, any>;
}

export interface SearchAnalytics {
  searchQuery: string;
  searchType: 'dish' | 'restaurant' | 'country' | 'ingredient' | 'general';
  searchFilters?: Record<string, any>;
  resultsCount?: number;
  resultsClicked?: number;
  searchSuccess?: boolean;
  timeToFirstClick?: number;
  searchSatisfaction?: number;
}

export interface PerformanceMetric {
  metricType: 'page_load' | 'image_load' | 'api_call' | 'error' | 'crash';
  metricName: string;
  metricValue?: number;
  metricUnit?: string;
  errorMessage?: string;
  errorStack?: string;
  errorSeverity?: 'low' | 'medium' | 'high' | 'critical';
  deviceInfo?: Record<string, any>;
  networkInfo?: Record<string, any>;
}

export interface UserBehaviorPreferences {
  preferredCuisineRegions?: string[];
  preferredSpiceLevels?: number[];
  preferredPriceRangeMin?: number;
  preferredPriceRangeMax?: number;
  preferredPickupTimes?: string[];
  preferredBrowsingTime?: string;
  preferredOrderingFrequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'occasional';
  preferredRestaurantDistance?: number;
  preferredDishCategories?: string[];
  culturalInterestLevel?: number;
  explorationStyle?: 'adventurous' | 'cautious' | 'balanced';
  dietaryRestrictions?: string[];
  averageSessionDuration?: number;
  sessionsPerWeek?: number;
  preferredScreens?: string[];
  notificationPreferences?: Record<string, any>;
  averageOrderValue?: number;
  preferredPaymentMethod?: string;
  tipPreference?: number;
  groupOrderingFrequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  reviewFrequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  ratingTendency?: 'generous' | 'average' | 'strict';
}

// Analytics Service Class
class AnalyticsService {
  private currentSessionId: string | null = null;
  private sessionStartTime: Date | null = null;
  private isInitialized = false;

  // Initialize analytics service
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate session ID
      this.currentSessionId = this.generateSessionId();
      this.sessionStartTime = new Date();

      // Create session record
      await this.createUserSession(user.id);
      
      this.isInitialized = true;
      console.log('Analytics service initialized');
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get device information
  private getDeviceInfo(): Record<string, any> {
    return {
      deviceType: Platform.OS,
      appVersion: Constants.expoConfig?.version || '1.0.0',
      osVersion: Platform.Version,
      deviceModel: Device.modelName || 'Unknown',
      screenResolution: `${Dimensions.get('window').width}x${Dimensions.get('window').height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: Platform.select({
        ios: Device.locale || 'en',
        android: Device.locale || 'en',
        default: 'en'
      })
    };
  }

  // Create user session
  private async createUserSession(userId: string): Promise<void> {
    try {
      const deviceInfo = this.getDeviceInfo();
      
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_id: this.currentSessionId!,
          device_type: deviceInfo.deviceType,
          app_version: deviceInfo.appVersion,
          os_version: deviceInfo.osVersion,
          device_model: deviceInfo.deviceModel,
          screen_resolution: deviceInfo.screenResolution,
          timezone: deviceInfo.timezone,
          language: deviceInfo.language,
          is_active: true
        });

      if (error) {
        console.error('Failed to create user session:', error);
      }
    } catch (error) {
      console.error('Error creating user session:', error);
    }
  }

  // End current session
  async endSession(): Promise<void> {
    if (!this.currentSessionId || !this.sessionStartTime) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sessionDuration = Math.floor((Date.now() - this.sessionStartTime.getTime()) / 1000);

      const { error } = await supabase
        .from('user_sessions')
        .update({
          session_end: new Date().toISOString(),
          session_duration: sessionDuration,
          is_active: false
        })
        .eq('session_id', this.currentSessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to end user session:', error);
      }

      this.currentSessionId = null;
      this.sessionStartTime = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Error ending user session:', error);
    }
  }

  // Track user event
  async trackEvent(event: UserEvent): Promise<void> {
    if (!this.isInitialized || !this.currentSessionId) {
      await this.initialize();
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          session_id: this.currentSessionId!,
          event_type: event.eventType,
          event_category: event.eventCategory,
          event_name: event.eventName,
          event_data: event.eventData || {},
          screen_name: event.screenName,
          screen_section: event.screenSection,
          element_id: event.elementId,
          element_type: event.elementType,
          element_text: event.elementText,
          interaction_method: event.interactionMethod
        });

      if (error) {
        console.error('Failed to track user event:', error);
      }
    } catch (error) {
      console.error('Error tracking user event:', error);
    }
  }

  // Track content interaction
  async trackContentInteraction(interaction: ContentInteraction): Promise<void> {
    if (!this.isInitialized || !this.currentSessionId) {
      await this.initialize();
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('content_interactions')
        .insert({
          user_id: user.id,
          session_id: this.currentSessionId!,
          content_type: interaction.contentType,
          content_id: interaction.contentId,
          interaction_type: interaction.interactionType,
          interaction_duration: interaction.interactionDuration,
          interaction_depth: interaction.interactionDepth,
          content_rating: interaction.contentRating,
          feedback_data: interaction.feedbackData || {}
        });

      if (error) {
        console.error('Failed to track content interaction:', error);
      }
    } catch (error) {
      console.error('Error tracking content interaction:', error);
    }
  }

  // Track search analytics
  async trackSearch(search: SearchAnalytics): Promise<void> {
    if (!this.isInitialized || !this.currentSessionId) {
      await this.initialize();
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('search_analytics')
        .insert({
          user_id: user.id,
          session_id: this.currentSessionId!,
          search_query: search.searchQuery,
          search_type: search.searchType,
          search_filters: search.searchFilters || {},
          results_count: search.resultsCount,
          results_clicked: search.resultsClicked,
          search_success: search.searchSuccess,
          time_to_first_click: search.timeToFirstClick,
          search_satisfaction: search.searchSatisfaction
        });

      if (error) {
        console.error('Failed to track search analytics:', error);
      }
    } catch (error) {
      console.error('Error tracking search analytics:', error);
    }
  }

  // Track performance metric
  async trackPerformance(metric: PerformanceMetric): Promise<void> {
    if (!this.isInitialized || !this.currentSessionId) {
      await this.initialize();
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          user_id: user.id,
          session_id: this.currentSessionId!,
          metric_type: metric.metricType,
          metric_name: metric.metricName,
          metric_value: metric.metricValue,
          metric_unit: metric.metricUnit,
          error_message: metric.errorMessage,
          error_stack: metric.errorStack,
          error_severity: metric.errorSeverity,
          device_info: metric.deviceInfo || this.getDeviceInfo(),
          network_info: metric.networkInfo || {}
        });

      if (error) {
        console.error('Failed to track performance metric:', error);
      }
    } catch (error) {
      console.error('Error tracking performance metric:', error);
    }
  }

  // Update user behavior preferences
  async updateBehaviorPreferences(preferences: UserBehaviorPreferences): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_behavior_preferences')
        .upsert({
          user_id: user.id,
          preferred_cuisine_regions: preferences.preferredCuisineRegions,
          preferred_spice_levels: preferences.preferredSpiceLevels,
          preferred_price_range_min: preferences.preferredPriceRangeMin,
          preferred_price_range_max: preferences.preferredPriceRangeMax,
          preferred_pickup_times: preferences.preferredPickupTimes,
          preferred_browsing_time: preferences.preferredBrowsingTime,
          preferred_ordering_frequency: preferences.preferredOrderingFrequency,
          preferred_restaurant_distance: preferences.preferredRestaurantDistance,
          preferred_dish_categories: preferences.preferredDishCategories,
          cultural_interest_level: preferences.culturalInterestLevel,
          exploration_style: preferences.explorationStyle,
          dietary_restrictions: preferences.dietaryRestrictions,
          average_session_duration: preferences.averageSessionDuration,
          sessions_per_week: preferences.sessionsPerWeek,
          preferred_screens: preferences.preferredScreens,
          notification_preferences: preferences.notificationPreferences,
          average_order_value: preferences.averageOrderValue,
          preferred_payment_method: preferences.preferredPaymentMethod,
          tip_preference: preferences.tipPreference,
          group_ordering_frequency: preferences.groupOrderingFrequency,
          review_frequency: preferences.reviewFrequency,
          rating_tendency: preferences.ratingTendency
        });

      if (error) {
        console.error('Failed to update behavior preferences:', error);
      }
    } catch (error) {
      console.error('Error updating behavior preferences:', error);
    }
  }

  // Track user journey event
  async trackJourneyEvent(
    journeyStage: string,
    journeyStep: string,
    stepOrder: number,
    timeSpentOnStep?: number,
    stepCompleted?: boolean,
    stepAbandoned?: boolean,
    abandonmentReason?: string,
    stepData?: Record<string, any>
  ): Promise<void> {
    if (!this.isInitialized || !this.currentSessionId) {
      await this.initialize();
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_journey_events')
        .insert({
          user_id: user.id,
          session_id: this.currentSessionId!,
          journey_stage: journeyStage,
          journey_step: journeyStep,
          step_order: stepOrder,
          time_spent_on_step: timeSpentOnStep,
          step_completed: stepCompleted || false,
          step_abandoned: stepAbandoned || false,
          abandonment_reason: abandonmentReason,
          step_data: stepData || {}
        });

      if (error) {
        console.error('Failed to track journey event:', error);
      }
    } catch (error) {
      console.error('Error tracking journey event:', error);
    }
  }

  // Get analytics data for admin dashboard
  async getAnalyticsData(timeRange: '7d' | '30d' | '90d' = '30d') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get user engagement overview
      const { data: engagementData } = await supabase
        .from('user_engagement_overview')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get popular content
      const { data: popularContent } = await supabase
        .from('popular_content')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('interaction_count', { ascending: false })
        .limit(10);

      // Get user journey funnel
      const { data: journeyFunnel } = await supabase
        .from('user_journey_funnel')
        .select('*')
        .gte('timestamp', startDate.toISOString());

      // Get search analytics
      const { data: searchAnalytics } = await supabase
        .from('search_analytics_summary')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('search_count', { ascending: false })
        .limit(10);

      // Get performance metrics
      const { data: performanceMetrics } = await supabase
        .from('performance_metrics_summary')
        .select('*')
        .gte('timestamp', startDate.toISOString());

      return {
        engagement: engagementData,
        popularContent,
        journeyFunnel,
        searchAnalytics,
        performanceMetrics
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return null;
    }
  }

  // Convenience methods for common events
  async trackScreenView(screenName: string, screenSection?: string): Promise<void> {
    await this.trackEvent({
      eventType: 'navigation',
      eventCategory: 'screen_view',
      eventName: 'screen_viewed',
      eventData: { screenName, screenSection },
      screenName,
      screenSection
    });
  }

  async trackButtonClick(buttonName: string, screenName?: string, elementText?: string): Promise<void> {
    await this.trackEvent({
      eventType: 'interaction',
      eventCategory: 'button_click',
      eventName: 'button_clicked',
      eventData: { buttonName },
      screenName,
      elementId: buttonName,
      elementType: 'button',
      elementText,
      interactionMethod: 'tap'
    });
  }

  async trackDishView(dishId: string, dishName: string, countryOrigin: string): Promise<void> {
    await this.trackContentInteraction({
      contentType: 'dish',
      contentId: dishId,
      interactionType: 'view',
      interactionDepth: 'moderate'
    });

    await this.trackEvent({
      eventType: 'content',
      eventCategory: 'dish_view',
      eventName: 'dish_viewed',
      eventData: { dishId, dishName, countryOrigin },
      screenName: 'DishDetail',
      elementId: dishId,
      elementType: 'dish',
      elementText: dishName
    });
  }

  async trackRestaurantView(restaurantId: string, restaurantName: string, cuisineType: string): Promise<void> {
    await this.trackContentInteraction({
      contentType: 'restaurant',
      contentId: restaurantId,
      interactionType: 'view',
      interactionDepth: 'moderate'
    });

    await this.trackEvent({
      eventType: 'content',
      eventCategory: 'restaurant_view',
      eventName: 'restaurant_viewed',
      eventData: { restaurantId, restaurantName, cuisineType },
      screenName: 'RestaurantDetail',
      elementId: restaurantId,
      elementType: 'restaurant',
      elementText: restaurantName
    });
  }

  async trackSearchQuery(query: string, searchType: 'dish' | 'restaurant' | 'country' | 'ingredient' | 'general'): Promise<void> {
    await this.trackSearch({
      searchQuery: query,
      searchType,
      searchFilters: {}
    });

    await this.trackEvent({
      eventType: 'search',
      eventCategory: 'search_query',
      eventName: 'search_performed',
      eventData: { query, searchType },
      screenName: 'Search',
      elementId: 'search_input',
      elementType: 'input',
      elementText: query,
      interactionMethod: 'type'
    });
  }

  async trackError(error: Error, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<void> {
    await this.trackPerformance({
      metricType: 'error',
      metricName: 'app_error',
      errorMessage: error.message,
      errorStack: error.stack,
      errorSeverity: severity
    });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience functions
export const trackEvent = (event: UserEvent) => analyticsService.trackEvent(event);
export const trackScreenView = (screenName: string, screenSection?: string) => analyticsService.trackScreenView(screenName, screenSection);
export const trackButtonClick = (buttonName: string, screenName?: string, elementText?: string) => analyticsService.trackButtonClick(buttonName, screenName, elementText);
export const trackDishView = (dishId: string, dishName: string, countryOrigin: string) => analyticsService.trackDishView(dishId, dishName, countryOrigin);
export const trackRestaurantView = (restaurantId: string, restaurantName: string, cuisineType: string) => analyticsService.trackRestaurantView(restaurantId, restaurantName, cuisineType);
export const trackSearchQuery = (query: string, searchType: 'dish' | 'restaurant' | 'country' | 'ingredient' | 'general') => analyticsService.trackSearchQuery(query, searchType);
export const trackError = (error: Error, severity?: 'low' | 'medium' | 'high' | 'critical') => analyticsService.trackError(error, severity); 