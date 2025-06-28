import { supabase } from './supabase';
import { locationService, UserLocation, RestaurantLocation } from './location-service';
import { Restaurant } from '@/types';

export interface NearbyRestaurant extends Restaurant {
  distance?: number;
  travelTime?: string;
}

export interface RestaurantFilters {
  cuisineType?: string;
  isOpen?: boolean;
  maxDistance?: number;
  minRating?: number;
}

class RestaurantService {
  private useMockData = false; // Changed to false to use Supabase data

  /**
   * Get all restaurants from Supabase
   */
  async getAllRestaurants(): Promise<Restaurant[]> {
    if (this.useMockData) {
      // Fallback to mock data if needed
      const { mockRestaurants } = await import('@/data/mockData');
      return mockRestaurants;
    }

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching restaurants:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  /**
   * Get nearby restaurants based on user location
   */
  async getNearbyRestaurants(
    userLocation: UserLocation,
    filters: RestaurantFilters = {}
  ): Promise<NearbyRestaurant[]> {
    try {
      const allRestaurants = await this.getAllRestaurants();
      
      // Convert to location format for distance calculation
      const restaurantLocations: RestaurantLocation[] = allRestaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        address: restaurant.address
      }));

      // Find nearby restaurants
      const maxDistance = filters.maxDistance || 10; // Default 10km radius
      const nearbyLocations = locationService.findNearbyRestaurants(
        restaurantLocations,
        userLocation,
        maxDistance
      );

      // Map back to full restaurant data with distance and travel time
      const nearbyRestaurants: NearbyRestaurant[] = nearbyLocations.map(location => {
        const restaurant = allRestaurants.find(r => r.id === location.id);
        if (!restaurant) return null;

        const travelTime = locationService.getEstimatedTravelTime(location.distance!);
        
        return {
          ...restaurant,
          distance: location.distance,
          travelTime
        };
      }).filter(Boolean) as NearbyRestaurant[];

      // Apply additional filters
      return this.applyFilters(nearbyRestaurants, filters);
    } catch (error) {
      console.error('Error getting nearby restaurants:', error);
      return [];
    }
  }

  /**
   * Get restaurants by cuisine type
   */
  async getRestaurantsByCuisine(cuisineType: string): Promise<Restaurant[]> {
    try {
      if (this.useMockData) {
        const allRestaurants = await this.getAllRestaurants();
        return allRestaurants.filter(restaurant => 
          restaurant.cuisine_type.toLowerCase() === cuisineType.toLowerCase()
        );
      }

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('cuisine_type', cuisineType)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching restaurants by cuisine:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching restaurants by cuisine:', error);
      return [];
    }
  }

  /**
   * Get restaurant by ID
   */
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      if (this.useMockData) {
        const allRestaurants = await this.getAllRestaurants();
        return allRestaurants.find(restaurant => restaurant.id === id) || null;
      }

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching restaurant by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      return null;
    }
  }

  /**
   * Search restaurants by name or description
   */
  async searchRestaurants(query: string): Promise<Restaurant[]> {
    try {
      if (this.useMockData) {
        const allRestaurants = await this.getAllRestaurants();
        const searchTerm = query.toLowerCase();
        
        return allRestaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.description.toLowerCase().includes(searchTerm) ||
          restaurant.cuisine_type.toLowerCase().includes(searchTerm)
        );
      }

      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,cuisine_type.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching restaurants:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error searching restaurants:', error);
      return [];
    }
  }

  /**
   * Get restaurants with location context
   */
  async getRestaurantsWithLocation(
    userLocation?: UserLocation,
    filters: RestaurantFilters = {}
  ): Promise<NearbyRestaurant[]> {
    if (!userLocation) {
      // If no location, return all restaurants without distance info
      const allRestaurants = await this.getAllRestaurants();
      return allRestaurants.map(restaurant => ({
        ...restaurant,
        distance: undefined,
        travelTime: undefined
      }));
    }

    return this.getNearbyRestaurants(userLocation, filters);
  }

  /**
   * Apply filters to restaurant list
   */
  private applyFilters(
    restaurants: NearbyRestaurant[],
    filters: RestaurantFilters
  ): NearbyRestaurant[] {
    let filtered = [...restaurants];

    // Filter by cuisine type
    if (filters.cuisineType && filters.cuisineType !== 'All') {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine_type === filters.cuisineType
      );
    }

    // Filter by open status
    if (filters.isOpen !== undefined) {
      filtered = filtered.filter(restaurant => 
        restaurant.is_open === filters.isOpen
      );
    }

    // Filter by minimum rating
    if (filters.minRating) {
      filtered = filtered.filter(restaurant => 
        restaurant.rating >= filters.minRating!
      );
    }

    return filtered;
  }

  /**
   * Get restaurant statistics
   */
  async getRestaurantStats(): Promise<{
    total: number;
    open: number;
    closed: number;
    byCuisine: Record<string, number>;
  }> {
    try {
      const allRestaurants = await this.getAllRestaurants();
      
      const stats = {
        total: allRestaurants.length,
        open: allRestaurants.filter(r => r.is_open).length,
        closed: allRestaurants.filter(r => !r.is_open).length,
        byCuisine: {} as Record<string, number>
      };

      // Count by cuisine type
      allRestaurants.forEach(restaurant => {
        const cuisine = restaurant.cuisine_type;
        stats.byCuisine[cuisine] = (stats.byCuisine[cuisine] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting restaurant stats:', error);
      return {
        total: 0,
        open: 0,
        closed: 0,
        byCuisine: {}
      };
    }
  }

  /**
   * Toggle between mock and Supabase data (for development/testing)
   */
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  /**
   * Get available cuisine types
   */
  async getCuisineTypes(): Promise<string[]> {
    try {
      const allRestaurants = await this.getAllRestaurants();
      const cuisineTypes = [...new Set(allRestaurants.map(r => r.cuisine_type))];
      return cuisineTypes.sort();
    } catch (error) {
      console.error('Error getting cuisine types:', error);
      return [];
    }
  }
}

export const restaurantService = new RestaurantService();
export default restaurantService; 