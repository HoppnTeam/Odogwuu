import { supabase } from './supabase';
import { Dish } from '@/types';

export interface DishWithRestaurant extends Dish {
  restaurant_name: string;
  cuisine_type: string;
}

/**
 * Fetch dishes by country for the country detail pages
 * This replaces mock data with real data from Supabase
 */
export async function getDishesByCountry(countryName: string): Promise<DishWithRestaurant[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_dishes_by_country', { country_name: countryName });

    if (error) {
      console.error('Error fetching dishes by country:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDishesByCountry:', error);
    return [];
  }
}

/**
 * Fetch featured dishes for the Discovery screen
 */
export async function getFeaturedDishes(): Promise<DishWithRestaurant[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_featured_dishes');

    if (error) {
      console.error('Error fetching featured dishes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedDishes:', error);
    return [];
  }
}

/**
 * Fetch all available dishes
 */
export async function getAllDishes(): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching all dishes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllDishes:', error);
    return [];
  }
}

/**
 * Fetch dishes by vendor/restaurant
 */
export async function getDishesByVendor(vendorId: string): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching dishes by vendor:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDishesByVendor:', error);
    return [];
  }
}

/**
 * Fetch a single dish by ID
 */
export async function getDishById(dishId: string): Promise<Dish | null> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('id', dishId)
      .eq('is_available', true)
      .single();

    if (error) {
      console.error('Error fetching dish by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getDishById:', error);
    return null;
  }
}

/**
 * Fetch dishes by spice level
 */
export async function getDishesBySpiceLevel(spiceLevel: number): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_available', true)
      .eq('spice_level', spiceLevel)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching dishes by spice level:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDishesBySpiceLevel:', error);
    return [];
  }
}

/**
 * Search dishes by name or description
 */
export async function searchDishes(query: string): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_available', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching dishes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchDishes:', error);
    return [];
  }
} 