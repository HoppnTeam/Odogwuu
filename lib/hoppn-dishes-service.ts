import { supabase } from './supabase';

export async function getHoppnDishesByCountry(country: string) {
  const { data, error } = await supabase
    .from('hoppn_dishes')
    .select('*')
    .eq('country_origin', country)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
} 