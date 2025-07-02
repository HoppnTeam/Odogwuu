import { supabase } from './supabase';
import { Restaurant, Dish } from '@/types';
import { NearbyRestaurant } from './restaurant-service';
import { UserLocation } from './location-service';
import { errorHandler, ErrorType, ErrorSeverity } from './error-handler';
import { analyticsService } from './analytics-service';

export interface SearchFilters {
  // Restaurant filters
  cuisineType?: string;
  isOpen?: boolean;
  maxDistance?: number;
  minRating?: number;
  maxPrice?: number;
  
  // Dish filters
  category?: string;
  countryOrigin?: string;
  spiceLevel?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  maxCalories?: number;
  
  // General filters
  sortBy?: 'distance' | 'rating' | 'price' | 'name' | 'popularity' | 'spice_level';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface SearchResult {
  type: 'restaurant' | 'dish';
  data: Restaurant | Dish;
  relevance: number;
  distance?: number;
  travelTime?: string;
}

export interface SearchSuggestion {
  text: string;
  type: 'restaurant' | 'dish' | 'cuisine' | 'country' | 'ingredient';
  count: number;
}

class SearchService {
  private useMockData = false;

  /**
   * Full-text search across restaurants and dishes
   */
  async globalSearch(
    query: string,
    filters: SearchFilters = {}
  ): Promise<SearchResult[]> {
    try {
      if (!query.trim()) return [];

      const searchTerm = query.toLowerCase().trim();
      const results: SearchResult[] = [];

      // Search restaurants
      const restaurants = await this.searchRestaurants(searchTerm, filters);
      results.push(...restaurants.map(r => ({
        type: 'restaurant' as const,
        data: r,
        relevance: this.calculateRelevance(searchTerm, r.name, r.description, r.cuisine_type),
        distance: r.distance,
        travelTime: r.travelTime
      })));

      // Search dishes
      const dishes = await this.searchDishes(searchTerm, filters);
      results.push(...dishes.map(d => ({
        type: 'dish' as const,
        data: d,
        relevance: this.calculateRelevance(searchTerm, d.name, d.description, d.country_origin)
      })));

      // Sort by relevance and apply additional sorting
      results.sort((a, b) => {
        // Primary sort by relevance
        if (b.relevance !== a.relevance) {
          return b.relevance - a.relevance;
        }

        // Secondary sort by rating
        const aRating = this.getRating(a.data);
        const bRating = this.getRating(b.data);
        return bRating - aRating;
      });

      // Apply limit
      const limit = filters.limit || 50;
      const limitedResults = results.slice(0, limit);

      // Track search analytics
      await analyticsService.trackSearch({
        searchQuery: query,
        searchType: 'general',
        searchFilters: filters,
        resultsCount: limitedResults.length,
        searchSuccess: limitedResults.length > 0
      });

      return limitedResults;
    } catch (error) {
      const appError = errorHandler.handleNetworkError(error, {
        action: 'global_search',
        data: { query, filters }
      });
      errorHandler.handleError(appError, false, true);
      return [];
    }
  }

  /**
   * Search restaurants with advanced filtering
   */
  async searchRestaurants(
    query: string,
    filters: SearchFilters = {}
  ): Promise<NearbyRestaurant[]> {
    try {
      if (this.useMockData) {
        return this.searchRestaurantsMock(query, filters);
      }

      let supabaseQuery = supabase
        .from('restaurants')
        .select('*');

      // Apply text search
      if (query) {
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,cuisine_type.ilike.%${query}%`
        );
      }

      // Apply filters
      if (filters.cuisineType && filters.cuisineType !== 'All') {
        supabaseQuery = supabaseQuery.eq('cuisine_type', filters.cuisineType);
      }

      if (filters.isOpen !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_open', filters.isOpen);
      }

      if (filters.minRating) {
        supabaseQuery = supabaseQuery.gte('rating', filters.minRating);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      
      switch (sortBy) {
        case 'rating':
          supabaseQuery = supabaseQuery.order('rating', { ascending: sortOrder === 'asc' });
          break;
        case 'name':
          supabaseQuery = supabaseQuery.order('name', { ascending: sortOrder === 'asc' });
          break;
        default:
          supabaseQuery = supabaseQuery.order('name', { ascending: true });
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        const appError = errorHandler.handleSupabaseError(error, {
          action: 'search_restaurants',
          data: { query, filters }
        });
        errorHandler.handleError(appError, false, true);
        return [];
      }

      let restaurants = data || [];

      return restaurants.map(r => ({
        ...r,
        distance: undefined,
        travelTime: undefined
      }));
    } catch (error) {
      const appError = errorHandler.handleNetworkError(error, {
        action: 'search_restaurants',
        data: { query, filters }
      });
      errorHandler.handleError(appError, false, true);
      return [];
    }
  }

  /**
   * Search dishes with advanced filtering
   */
  async searchDishes(
    query: string,
    filters: SearchFilters = {}
  ): Promise<Dish[]> {
    try {
      if (this.useMockData) {
        return this.searchDishesMock(query, filters);
      }

      let supabaseQuery = supabase
        .from('dishes')
        .select('*')
        .eq('is_active', true);

      // Apply text search
      if (query) {
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,country_origin.ilike.%${query}%,base_ingredients.ilike.%${query}%`
        );
      }

      // Apply filters
      if (filters.category) {
        supabaseQuery = supabaseQuery.eq('category', filters.category);
      }

      if (filters.countryOrigin) {
        supabaseQuery = supabaseQuery.eq('country_origin', filters.countryOrigin);
      }

      if (filters.spiceLevel) {
        supabaseQuery = supabaseQuery.eq('base_spice_level', filters.spiceLevel);
      }

      if (filters.isVegetarian !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_vegetarian', filters.isVegetarian);
      }

      if (filters.isVegan !== undefined) {
        supabaseQuery = supabaseQuery.eq('is_vegan', filters.isVegan);
      }

      if (filters.maxCalories) {
        supabaseQuery = supabaseQuery.lte('calories', filters.maxCalories);
      }

      if (filters.maxPrice) {
        supabaseQuery = supabaseQuery.lte('base_price', filters.maxPrice);
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      
      switch (sortBy) {
        case 'price':
          supabaseQuery = supabaseQuery.order('base_price', { ascending: sortOrder === 'asc' });
          break;
        case 'spice_level':
          supabaseQuery = supabaseQuery.order('base_spice_level', { ascending: sortOrder === 'asc' });
          break;
        case 'name':
        default:
          supabaseQuery = supabaseQuery.order('name', { ascending: sortOrder === 'asc' });
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        const appError = errorHandler.handleSupabaseError(error, {
          action: 'search_dishes',
          data: { query, filters }
        });
        errorHandler.handleError(appError, false, true);
        return [];
      }

      return data || [];
    } catch (error) {
      const appError = errorHandler.handleNetworkError(error, {
        action: 'search_dishes',
        data: { query, filters }
      });
      errorHandler.handleError(appError, false, true);
      return [];
    }
  }

  /**
   * Get search suggestions based on popular searches and available data
   */
  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      if (!query.trim()) return [];

      const suggestions: SearchSuggestion[] = [];
      const searchTerm = query.toLowerCase().trim();

      // Get popular cuisine types
      const { data: cuisines } = await supabase
        .from('restaurants')
        .select('cuisine_type')
        .ilike('cuisine_type', `%${searchTerm}%`)
        .limit(5);

      cuisines?.forEach(cuisine => {
        suggestions.push({
          text: cuisine.cuisine_type,
          type: 'cuisine',
          count: 1
        });
      });

      // Get popular countries
      const { data: countries } = await supabase
        .from('dishes')
        .select('country_origin')
        .ilike('country_origin', `%${searchTerm}%`)
        .limit(5);

      countries?.forEach(country => {
        suggestions.push({
          text: country.country_origin,
          type: 'country',
          count: 1
        });
      });

      // Get popular dish names
      const { data: dishes } = await supabase
        .from('dishes')
        .select('name')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);

      dishes?.forEach(dish => {
        suggestions.push({
          text: dish.name,
          type: 'dish',
          count: 1
        });
      });

      // Get popular restaurant names
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('name')
        .ilike('name', `%${searchTerm}%`)
        .limit(5);

      restaurants?.forEach(restaurant => {
        suggestions.push({
          text: restaurant.name,
          type: 'restaurant',
          count: 1
        });
      });

      // Remove duplicates and sort by relevance
      const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
        index === self.findIndex(s => s.text === suggestion.text)
      );

      return uniqueSuggestions.slice(0, 10);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  /**
   * Get nearby restaurants with enhanced filtering
   */
  async getNearbyRestaurants(
    userLocation: UserLocation,
    filters: SearchFilters = {}
  ): Promise<NearbyRestaurant[]> {
    try {
      const maxDistance = filters.maxDistance || 10;
      
      // Use PostGIS function if available, otherwise fallback to client-side filtering
      const { data, error } = await supabase
        .rpc('get_nearby_restaurants', {
          user_lat: userLocation.latitude,
          user_lng: userLocation.longitude,
          radius_km: maxDistance
        });

      if (error) {
        // Fallback to client-side filtering
        return this.getNearbyRestaurantsFallback(userLocation, filters);
      }

      let restaurants = data || [];

      // Apply additional filters
      if (filters.cuisineType && filters.cuisineType !== 'All') {
        restaurants = restaurants.filter((r: any) => r.cuisine_type === filters.cuisineType);
      }

      if (filters.isOpen !== undefined) {
        restaurants = restaurants.filter((r: any) => r.is_open === filters.isOpen);
      }

      if (filters.minRating) {
        restaurants = restaurants.filter((r: any) => r.rating >= filters.minRating!);
      }

      return restaurants;
    } catch (error) {
      const appError = errorHandler.handleNetworkError(error, {
        action: 'get_nearby_restaurants',
        data: { userLocation, filters }
      });
      errorHandler.handleError(appError, false, true);
      return [];
    }
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevance(searchTerm: string, ...fields: string[]): number {
    let relevance = 0;
    const term = searchTerm.toLowerCase();

    fields.forEach(field => {
      if (!field) return;
      
      const fieldLower = field.toLowerCase();
      
      // Exact match gets highest score
      if (fieldLower === term) {
        relevance += 100;
      }
      // Starts with search term
      else if (fieldLower.startsWith(term)) {
        relevance += 50;
      }
      // Contains search term
      else if (fieldLower.includes(term)) {
        relevance += 25;
      }
      // Word boundary match
      else if (fieldLower.includes(` ${term} `) || fieldLower.startsWith(`${term} `) || fieldLower.endsWith(` ${term}`)) {
        relevance += 30;
      }
    });

    return relevance;
  }

  /**
   * Get rating from search result data
   */
  private getRating(data: Restaurant | Dish): number {
    if ('rating' in data) {
      return data.rating || 0;
    }
    return 0;
  }

  /**
   * Apply location-based filtering
   */
  private applyLocationFilter(
    restaurants: Restaurant[],
    userLocation: UserLocation,
    maxDistance?: number
  ): Restaurant[] {
    const distance = maxDistance || 10;
    
    return restaurants.filter(restaurant => {
      const restaurantDistance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
      return restaurantDistance <= distance;
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Fallback method for nearby restaurants when PostGIS is not available
   */
  private async getNearbyRestaurantsFallback(
    userLocation: UserLocation,
    filters: SearchFilters = {}
  ): Promise<NearbyRestaurant[]> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_open', true);

      if (error) throw error;

      const restaurants = data || [];
      const maxDistance = filters.maxDistance || 10;

      return restaurants
        .map(restaurant => ({
          ...restaurant,
          distance: this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            restaurant.latitude,
            restaurant.longitude
          )
        }))
        .filter(restaurant => restaurant.distance <= maxDistance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
      console.error('Error in fallback nearby restaurants:', error);
      return [];
    }
  }

  // Mock data methods for development
  private async searchRestaurantsMock(
    query: string,
    filters: SearchFilters = {}
  ): Promise<NearbyRestaurant[]> {
    // Implementation would use mock data
    return [];
  }

  private async searchDishesMock(
    query: string,
    filters: SearchFilters = {}
  ): Promise<Dish[]> {
    // Implementation would use mock data
    return [];
  }
}

export const searchService = new SearchService(); 