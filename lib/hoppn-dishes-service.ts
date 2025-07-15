import { supabase } from './supabase';
import { Dish } from '@/types';

export async function getHoppnDishesByCountry(country: string): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('hoppn_dishes')
      .select('*')
      .eq('country_origin', country)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching dishes by country:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getHoppnDishesByCountry:', error);
    return [];
  }
}

export async function getHoppnDishById(id: string): Promise<Dish | null> {
  try {
    const { data, error } = await supabase
      .from('hoppn_dishes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching hoppn dish by ID:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in getHoppnDishById:', error);
    return null;
  }
} 