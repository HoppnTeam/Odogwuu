import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface RestaurantLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distance?: number; // in kilometers
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

class LocationService {
  private currentLocation: UserLocation | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;

  /**
   * Request location permissions
   */
  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain: status !== Location.PermissionStatus.DENIED,
        status
      };
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED
      };
    }
  }

  /**
   * Check current location permission status
   */
  async checkLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === Location.PermissionStatus.GRANTED,
        canAskAgain,
        status
      };
    } catch (error) {
      console.error('Error checking location permission:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: Location.PermissionStatus.DENIED
      };
    }
  }

  /**
   * Get current user location
   */
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const permission = await this.checkLocationPermission();
      
      if (!permission.granted) {
        const requestResult = await this.requestLocationPermission();
        if (!requestResult.granted) {
          Alert.alert(
            'Location Permission Required',
            'Hoppn needs your location to find nearby African restaurants. Please enable location access in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        timestamp: location.timestamp
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your GPS settings and try again.'
      );
      return null;
    }
  }

  /**
   * Start watching user location for real-time updates
   */
  async startLocationWatching(
    onLocationUpdate: (location: UserLocation) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      const permission = await this.checkLocationPermission();
      
      if (!permission.granted) {
        const requestResult = await this.requestLocationPermission();
        if (!requestResult.granted) {
          onError?.('Location permission denied');
          return;
        }
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50 // Update when user moves 50 meters
        },
        (location) => {
          const userLocation: UserLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || undefined,
            timestamp: location.timestamp
          };
          
          this.currentLocation = userLocation;
          onLocationUpdate(userLocation);
        }
      );
    } catch (error) {
      console.error('Error starting location watching:', error);
      onError?.(error);
    }
  }

  /**
   * Stop watching user location
   */
  stopLocationWatching(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  calculateDistance(
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
    const distance = R * c; // Distance in kilometers
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Convert degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Find nearby restaurants within a specified radius
   */
  findNearbyRestaurants(
    restaurants: RestaurantLocation[],
    userLocation: UserLocation,
    radiusKm: number = 10
  ): RestaurantLocation[] {
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
      .filter(restaurant => restaurant.distance! <= radiusKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Format distance for display
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  /**
   * Get estimated travel time based on distance
   */
  getEstimatedTravelTime(distanceKm: number, mode: 'walking' | 'driving' = 'driving'): string {
    const avgSpeed = mode === 'walking' ? 5 : 30; // km/h
    const timeMinutes = Math.round((distanceKm / avgSpeed) * 60);
    
    if (timeMinutes < 1) {
      return '< 1 min';
    } else if (timeMinutes < 60) {
      return `${timeMinutes} min`;
    } else {
      const hours = Math.floor(timeMinutes / 60);
      const minutes = timeMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }

  /**
   * Get current location if available, otherwise return null
   */
  getStoredLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Check if location services are enabled
   */
  async isLocationEnabled(): Promise<boolean> {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      return enabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }
}

export const locationService = new LocationService();
export default locationService; 