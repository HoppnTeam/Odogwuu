import { createClient } from '@supabase/supabase-js';
import { ENV_CONFIG, validateEnvironment } from '@/config/env';

// Validate environment variables
validateEnvironment();

// Create Supabase client with proper configuration
export const supabase = createClient(ENV_CONFIG.SUPABASE_URL, ENV_CONFIG.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          phone_number?: string;
          dietary_preferences?: string[];
          spice_tolerance?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          phone_number?: string;
          dietary_preferences?: string[];
          spice_tolerance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          phone_number?: string;
          dietary_preferences?: string[];
          spice_tolerance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          cuisine_type: string;
          rating: number;
          pickup_time: string;
          address: string;
          latitude: number;
          longitude: number;
          is_open: boolean;
          opening_hours: string;
          phone_number: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          cuisine_type: string;
          rating?: number;
          pickup_time: string;
          address: string;
          latitude: number;
          longitude: number;
          is_open?: boolean;
          opening_hours: string;
          phone_number: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          cuisine_type?: string;
          rating?: number;
          pickup_time?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          is_open?: boolean;
          opening_hours?: string;
          phone_number?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      dishes: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string;
          image_url: string;
          price: number;
          category: string;
          spice_level: number;
          country_origin: string;
          country_flag: string;
          origin_story: string;
          ingredients: string[];
          is_vegetarian: boolean;
          is_vegan: boolean;
          calories?: number;
          preparation_method?: string;
          cultural_significance?: string;
          health_benefits?: string;
          native_regions?: string[];
          taste_profile?: string;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description: string;
          image_url: string;
          price: number;
          category: string;
          spice_level: number;
          country_origin: string;
          country_flag: string;
          origin_story: string;
          ingredients: string[];
          is_vegetarian: boolean;
          is_vegan: boolean;
          calories?: number;
          preparation_method?: string;
          cultural_significance?: string;
          health_benefits?: string;
          native_regions?: string[];
          taste_profile?: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          price?: number;
          category?: string;
          spice_level?: number;
          country_origin?: string;
          country_flag?: string;
          origin_story?: string;
          ingredients?: string[];
          is_vegetarian?: boolean;
          is_vegan?: boolean;
          calories?: number;
          preparation_method?: string;
          cultural_significance?: string;
          health_benefits?: string;
          native_regions?: string[];
          taste_profile?: string;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          vendor_id: string;
          items: any; // JSON array of CartItem
          total_amount: number;
          tax_amount: number;
          service_fee: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
          pickup_location: string;
          payment_method: string;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          estimated_pickup_time?: string;
          actual_pickup_time?: string;
          special_instructions?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vendor_id: string;
          items: any;
          total_amount: number;
          tax_amount: number;
          service_fee: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
          pickup_location: string;
          payment_method: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          estimated_pickup_time?: string;
          actual_pickup_time?: string;
          special_instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vendor_id?: string;
          items?: any;
          total_amount?: number;
          tax_amount?: number;
          service_fee?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
          pickup_location?: string;
          payment_method?: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          estimated_pickup_time?: string;
          actual_pickup_time?: string;
          special_instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          dish_id?: string;
          vendor_id?: string;
          order_id: string;
          rating: number;
          comment?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dish_id?: string;
          vendor_id?: string;
          order_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dish_id?: string;
          vendor_id?: string;
          order_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
    };
  };
};