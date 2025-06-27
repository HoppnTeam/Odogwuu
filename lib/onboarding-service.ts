import { supabase } from './supabase';
import { OnboardingData, User } from '@/types';

export const onboardingService = {
  // Save onboarding data to user profile
  async saveOnboardingData(userId: string, onboardingData: Omit<OnboardingData, 'userId' | 'completedAt' | 'onboardingVersion'>): Promise<{ success: boolean; error?: string }> {
    try {
      const dataToSave: OnboardingData = {
        ...onboardingData,
        userId,
        completedAt: new Date().toISOString(),
        onboardingVersion: '1.0'
      };

      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          onboarding_data: dataToSave
        })
        .eq('id', userId);

      if (error) {
        console.error('Error saving onboarding data:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in saveOnboardingData:', error);
      return { success: false, error: error.message };
    }
  },

  // Get onboarding data for a user
  async getOnboardingData(userId: string): Promise<{ data?: OnboardingData; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_data, onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching onboarding data:', error);
        return { error: error.message };
      }

      return { data: data?.onboarding_data };
    } catch (error: any) {
      console.error('Error in getOnboardingData:', error);
      return { error: error.message };
    }
  },

  // Check if user has completed onboarding
  async isOnboardingCompleted(userId: string): Promise<{ completed: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) {
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
      // First get existing data
      const { data: existingData } = await this.getOnboardingData(userId);
      
      const updatedData = {
        ...existingData,
        ...partialData,
        userId,
        onboardingVersion: '1.0'
      };

      const { error } = await supabase
        .from('users')
        .update({
          onboarding_data: updatedData
        })
        .eq('id', userId);

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
        .limit(20);

      // Filter by dietary preferences
      if (onboardingData.dietaryPreferences.length > 0 && !onboardingData.dietaryPreferences.includes('no-restrictions')) {
        if (onboardingData.dietaryPreferences.includes('vegetarian')) {
          query = query.eq('is_vegetarian', true);
        }
        if (onboardingData.dietaryPreferences.includes('vegan')) {
          query = query.eq('is_vegan', true);
        }
        // Add more dietary filters as needed
      }

      // Filter by spice level
      query = query.lte('spice_level', onboardingData.spiceLevel);

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