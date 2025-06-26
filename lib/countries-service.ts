import { supabase } from './supabase';
import { CountryInfo } from '@/types';

export interface CountryWithDishCount extends CountryInfo {
  dish_count: number;
  region: string;
}

/**
 * Fetch all countries for the Discovery screen
 * This replaces the mock data with real data from Supabase
 */
export async function getCountries(): Promise<CountryInfo[]> {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('name, flag, description')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching countries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCountries:', error);
    return [];
  }
}

/**
 * Fetch countries with dish counts for enhanced display
 */
export async function getCountriesWithDishCounts(): Promise<CountryWithDishCount[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_countries_for_discovery');

    if (error) {
      console.error('Error fetching countries with dish counts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCountriesWithDishCounts:', error);
    return [];
  }
}

/**
 * Fetch countries by region (West African, East African, etc.)
 */
export async function getCountriesByRegion(region: string): Promise<CountryInfo[]> {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('name, flag, description')
      .eq('is_active', true)
      .eq('region', region)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching countries by region:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCountriesByRegion:', error);
    return [];
  }
}

/**
 * Get a single country by name
 */
export async function getCountryByName(name: string): Promise<CountryInfo | null> {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('name, flag, description')
      .eq('is_active', true)
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching country by name:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCountryByName:', error);
    return null;
  }
} 