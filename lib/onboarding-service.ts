import { supabase } from './supabase';
import { OnboardingData, User } from '@/types';

export const onboardingService = {
  // Save onboarding data to both users and onboarding_data tables
  async saveOnboardingData(userId: string, onboardingData: Omit<OnboardingData, 'userId' | 'completedAt' | 'onboardingVersion'>): Promise<{ success: boolean; error?: string }> {
    try {
      // Convert onboarding data to database format
      const dietaryPreferences = onboardingData.dietaryPreferences?.map(pref => pref) || [];
      const spiceTolerance = onboardingData.spiceLevel || 3;
      
      // Map exploration style to database-compatible values
      let explorationStyle = 'balanced'; // default
      if (onboardingData.explorationStyle) {
        switch (onboardingData.explorationStyle) {
          case 'gentle-explorer':
            explorationStyle = 'cautious';
            break;
          case 'cultural-curious':
            explorationStyle = 'balanced';
            break;
          case 'bold-adventurer':
            explorationStyle = 'adventurous';
            break;
          case 'specific-seeker':
            explorationStyle = 'balanced';
            break;
          default:
            explorationStyle = 'balanced';
        }
      }
      
      const orderFrequency = onboardingData.orderFrequency || 'occasional';

      // 1. Update users table with core preferences
      const { error: userError } = await supabase
        .from('users')
        .update({
          dietary_preferences: dietaryPreferences,
          spice_tolerance: spiceTolerance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (userError) {
        console.error('Error updating user table:', userError);
        return { success: false, error: userError.message };
      }

      // 2. Save detailed onboarding data to onboarding_data table
      const { error: onboardingError } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: userId,
          dietary_preferences: dietaryPreferences,
          spice_tolerance: spiceTolerance,
          exploration_style: explorationStyle,
          order_frequency: orderFrequency,
          location_permissions: false, // Will be updated when user grants location
          notification_permissions: false, // Will be updated when user grants notifications
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (onboardingError) {
        console.error('Error saving onboarding data:', onboardingError);
        return { success: false, error: onboardingError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in saveOnboardingData:', error);
      return { success: false, error: error.message };
    }
  },

  // Get onboarding data for a user (from onboarding_data table)
  async getOnboardingData(userId: string): Promise<{ data?: OnboardingData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching onboarding data:', error);
        return { error: error.message };
      }

      if (!data) {
        return { data: undefined };
      }

      // Convert database format to app format
      const onboardingData: OnboardingData = {
        dietaryPreferences: data.dietary_preferences || [],
        spiceLevel: data.spice_tolerance || 3,
        explorationStyle: data.exploration_style || 'cultural-curious',
        orderFrequency: data.order_frequency || 'occasional'
      };

      // Map database exploration_style back to app values
      if (data.exploration_style) {
        switch (data.exploration_style) {
          case 'cautious':
            onboardingData.explorationStyle = 'gentle-explorer';
            break;
          case 'balanced':
            onboardingData.explorationStyle = 'cultural-curious';
            break;
          case 'adventurous':
            onboardingData.explorationStyle = 'bold-adventurer';
            break;
          default:
            onboardingData.explorationStyle = 'cultural-curious';
        }
      }

      return { data: onboardingData };
    } catch (error: any) {
      console.error('Error in getOnboardingData:', error);
      return { error: error.message };
    }
  },

  // Check if user has completed onboarding
  async isOnboardingCompleted(userId: string): Promise<{ completed: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('onboarding_data')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking onboarding status:', error);
        return { completed: false, error: error.message };
      }

      return { completed: data?.onboarding_completed || false };
    } catch (error: any) {
      console.error('Error in isOnboardingCompleted:', error);
      return { completed: false, error: error.message };
    }
  },

  // Update partial onboarding data (for step-by-step saving)
  async updateOnboardingData(userId: string, partialData: Partial<OnboardingData>): Promise<{ success: boolean; error?: string }> {
    try {
      // Convert partial data to database format
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (partialData.dietaryPreferences) {
        updateData.dietary_preferences = partialData.dietaryPreferences;
      }
      if (partialData.spiceLevel) {
        updateData.spice_tolerance = partialData.spiceLevel;
      }
      if (partialData.explorationStyle) {
        // Map exploration style to database-compatible values
        let explorationStyle = 'balanced'; // default
        switch (partialData.explorationStyle) {
          case 'gentle-explorer':
            explorationStyle = 'cautious';
            break;
          case 'cultural-curious':
            explorationStyle = 'balanced';
            break;
          case 'bold-adventurer':
            explorationStyle = 'adventurous';
            break;
          case 'specific-seeker':
            explorationStyle = 'balanced';
            break;
          default:
            explorationStyle = 'balanced';
        }
        updateData.exploration_style = explorationStyle;
      }
      if (partialData.orderFrequency) {
        updateData.order_frequency = partialData.orderFrequency;
      }

      const { error } = await supabase
        .from('onboarding_data')
        .upsert({
          user_id: userId,
          ...updateData
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating onboarding data:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in updateOnboardingData:', error);
      return { success: false, error: error.message };
    }
  },

  // Get personalized dish recommendations based on onboarding data
  async getPersonalizedRecommendations(userId: string): Promise<{ dishes?: any[]; error?: string }> {
    try {
      const { data: onboardingData } = await this.getOnboardingData(userId);
      
      if (!onboardingData) {
        return { error: 'No onboarding data found' };
      }

      // Build query based on preferences
      let query = supabase
        .from('dishes')
        .select('*')
        .eq('is_active', true)
        .limit(20);

      // Filter by dietary preferences
      if (onboardingData.dietaryPreferences && onboardingData.dietaryPreferences.length > 0 && !onboardingData.dietaryPreferences.includes('no-restrictions')) {
        if (onboardingData.dietaryPreferences.includes('vegetarian')) {
          query = query.eq('is_vegetarian', true);
        }
        if (onboardingData.dietaryPreferences.includes('vegan')) {
          query = query.eq('is_vegan', true);
        }
        // Add more dietary filters as needed
      }

      // Filter by spice level
      query = query.lte('base_spice_level', onboardingData.spiceLevel);

      const { data: dishes, error } = await query;

      if (error) {
        console.error('Error fetching personalized recommendations:', error);
        return { error: error.message };
      }

      return { dishes };
    } catch (error: any) {
      console.error('Error in getPersonalizedRecommendations:', error);
      return { error: error.message };
    }
  }
}; 