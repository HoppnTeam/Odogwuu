import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, MapPin, Clock, Star, Navigation } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { Restaurant } from '@/types';
import { NearbyRestaurant } from '@/lib/restaurant-service';
import { ENV_CONFIG } from '@/config/env';
import { useLocation } from '@/contexts/LocationContext';

interface RestaurantMapProps {
  restaurants: NearbyRestaurant[];
  onClose: () => void;
  onRestaurantPress: (restaurant: NearbyRestaurant) => void;
}

const { width, height } = Dimensions.get('window');

let Mapbox: typeof import('@rnmapbox/maps') | null = null;
let isMapboxAvailable = true;
try {
  Mapbox = require('@rnmapbox/maps');
} catch (e) {
  isMapboxAvailable = false;
}

export default function RestaurantMap({ restaurants, onClose, onRestaurantPress }: RestaurantMapProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<NearbyRestaurant | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const { userLocation: contextLocation } = useLocation();

  useEffect(() => {
    if (contextLocation) {
      setUserLocation([contextLocation.longitude, contextLocation.latitude]);
    }
  }, [contextLocation]);

  const getMarkerColor = (restaurant: NearbyRestaurant) => {
    if (!restaurant.is_open) return '#EF4444'; // Red for closed
    if (restaurant.distance && restaurant.distance <= 2) return '#10B981'; // Green for very close
    return '#F15029'; // Orange for standard distance
  };

  const handleMarkerPress = (restaurant: NearbyRestaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleCenterOnUser = () => {
    // Camera functionality will be implemented when Mapbox API is properly configured
    console.log('Center on user functionality - to be implemented');
  };

  const handleRestaurantSelect = (restaurant: NearbyRestaurant) => {
    onRestaurantPress(restaurant);
    onClose();
  };

  const renderRestaurantInfo = () => {
    if (!selectedRestaurant) return null;

    return (
      <View style={styles.infoPanel}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitle}>{selectedRestaurant.name}</Text>
          <TouchableOpacity onPress={() => setSelectedRestaurant(null)} style={styles.closeInfoButton}>
            <X size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.infoCuisine}>{selectedRestaurant.cuisine_type}</Text>
        
        <View style={styles.infoRating}>
          <Star size={16} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.infoRatingText}>{selectedRestaurant.rating}</Text>
        </View>
        
        <View style={styles.infoDetails}>
          <View style={styles.infoRow}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText} numberOfLines={2}>
              {selectedRestaurant.address}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={14} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              Ready in {selectedRestaurant.pickup_time}
            </Text>
          </View>
        </View>
        
        <View style={styles.infoFooter}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: selectedRestaurant.is_open ? Colors.success + '20' : Colors.error + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: selectedRestaurant.is_open ? Colors.success : Colors.error }
            ]}>
              {selectedRestaurant.is_open ? '🟢 Open' : '🔴 Closed'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleRestaurantSelect(selectedRestaurant)}
          >
            <Text style={styles.selectButtonText}>View Restaurant</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!isMapboxAvailable) {
    // Expo Go placeholder (no image)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.primary, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Bold', color: Colors.primary, marginBottom: 12 }}>Map Feature Unavailable</Text>
          <Text style={{ fontSize: 16, fontFamily: 'OpenSans-Regular', color: Colors.text.secondary, textAlign: 'center', marginBottom: 24 }}>
            The interactive map requires a custom development build. Please use EAS Dev Client to view the map feature.
          </Text>
          <TouchableOpacity onPress={onClose} style={{ backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 }}>
            <Text style={{ color: Colors.text.inverse, fontSize: 16, fontFamily: 'Montserrat-SemiBold' }}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Use Mapbox! (non-null assertion) below, since we know it's available
  const MapboxLib = Mapbox!;
  MapboxLib.setAccessToken(ENV_CONFIG.MAPBOX_ACCESS_TOKEN);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Restaurant Map</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          {restaurants.length} African restaurants in your area
        </Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapboxLib.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={MapboxLib.StyleURL.Street}
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={true}
          scaleBarEnabled={false}
        >
          {/* User Location */}
          {userLocation && (
            <MapboxLib.PointAnnotation
              id="userLocation"
              coordinate={userLocation}
            >
              <View style={styles.userLocationMarker}>
                <View style={styles.userLocationDot} />
                <View style={styles.userLocationRing} />
              </View>
            </MapboxLib.PointAnnotation>
          )}

          {/* Restaurant Markers */}
          {restaurants.map((restaurant, index) => (
            <MapboxLib.PointAnnotation
              key={restaurant.id}
              id={`restaurant-${restaurant.id}`}
              coordinate={[restaurant.longitude, restaurant.latitude]}
            >
              <TouchableOpacity
                onPress={() => handleMarkerPress(restaurant)}
                style={[
                  styles.restaurantMarker,
                  { backgroundColor: getMarkerColor(restaurant) }
                ]}
              >
                <MapPin size={16} color={Colors.white} />
              </TouchableOpacity>
            </MapboxLib.PointAnnotation>
          ))}
        </MapboxLib.MapView>

        {/* Center on User Button */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={handleCenterOnUser}
        >
          <Navigation size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Restaurant Info Panel */}
      {renderRestaurantInfo()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userLocationRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '30',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  restaurantMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  centerButton: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  infoTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  closeInfoButton: {
    padding: Spacing.xs,
  },
  infoCuisine: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  infoRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoRatingText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  infoDetails: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  infoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
  },
  selectButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
  },
}); 