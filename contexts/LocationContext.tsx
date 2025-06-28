import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { locationService, UserLocation, LocationPermissionStatus } from '@/lib/location-service';

interface LocationContextType {
  // Location state
  userLocation: UserLocation | null;
  locationPermission: LocationPermissionStatus | null;
  isLocationEnabled: boolean;
  isLoading: boolean;
  
  // Location actions
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<UserLocation | null>;
  startLocationWatching: () => void;
  stopLocationWatching: () => void;
  refreshLocation: () => Promise<void>;
  
  // Location status
  hasLocationPermission: boolean;
  canRequestLocation: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check location services and permissions on mount
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      setIsLoading(true);
      
      // Check if location services are enabled
      const locationEnabled = await locationService.isLocationEnabled();
      setIsLocationEnabled(locationEnabled);
      
      if (!locationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to find nearby restaurants.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Check current permission status
      const permission = await locationService.checkLocationPermission();
      setLocationPermission(permission);
      
      // If permission granted, get current location
      if (permission.granted) {
        const location = await locationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
        }
      }
    } catch (error) {
      console.error('Error initializing location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const permission = await locationService.requestLocationPermission();
      setLocationPermission(permission);
      
      if (permission.granted) {
        const location = await locationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<UserLocation | null> => {
    try {
      setIsLoading(true);
      
      const location = await locationService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
      }
      
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startLocationWatching = () => {
    locationService.startLocationWatching(
      (location) => {
        setUserLocation(location);
      },
      (error) => {
        console.error('Location watching error:', error);
      }
    );
  };

  const stopLocationWatching = () => {
    locationService.stopLocationWatching();
  };

  const refreshLocation = async () => {
    await getCurrentLocation();
  };

  const hasLocationPermission = locationPermission?.granted || false;
  const canRequestLocation = locationPermission?.canAskAgain || false;

  const value: LocationContextType = {
    userLocation,
    locationPermission,
    isLocationEnabled,
    isLoading,
    requestLocationPermission,
    getCurrentLocation,
    startLocationWatching,
    stopLocationWatching,
    refreshLocation,
    hasLocationPermission,
    canRequestLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 