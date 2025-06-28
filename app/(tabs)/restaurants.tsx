import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, Clock, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useLocation } from '@/contexts/LocationContext';
import { restaurantService, NearbyRestaurant } from '@/lib/restaurant-service';
import { locationService } from '@/lib/location-service';

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCuisine, setFilterCuisine] = useState<string | null>(null);

  const { 
    userLocation, 
    hasLocationPermission, 
    requestLocationPermission
  } = useLocation();

  useEffect(() => {
    loadRestaurants();
  }, [userLocation]);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      
      if (userLocation) {
        const nearbyRestaurants = await restaurantService.getNearbyRestaurants(userLocation);
        setRestaurants(nearbyRestaurants);
      } else {
        // If no location, show all restaurants
        const allRestaurants = await restaurantService.getAllRestaurants();
        setRestaurants(allRestaurants.map(r => ({ ...r, distance: undefined, travelTime: undefined })));
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      Alert.alert('Error', 'Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationPermission = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      loadRestaurants();
    }
  };

  const handleRestaurantPress = (restaurant: NearbyRestaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return locationService.formatDistance(distance);
  };

  const getFilteredRestaurants = () => {
    if (!filterCuisine) return restaurants;
    return restaurants.filter(r => r.cuisine_type === filterCuisine);
  };

  const renderRestaurantCard = ({ item }: { item: NearbyRestaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.restaurantHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.cuisineType}>{item.cuisine_type}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>(reviews)</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            { color: item.is_open ? Colors.success : Colors.error }
          ]}>
            {item.is_open ? '🟢 Open' : '🔴 Closed'}
          </Text>
        </View>
      </View>

      <View style={styles.restaurantDetails}>
        <View style={styles.detailRow}>
          <MapPin size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>
            {item.address}
            {item.distance && ` • ${formatDistance(item.distance)} away`}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>
            Ready in {item.pickup_time}
            {item.travelTime && ` • ${item.travelTime} travel`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Restaurants</Text>
        {/* Temporarily disabled for testing - requires Mapbox token
        <TouchableOpacity onPress={() => setShowMap(true)} style={styles.mapButton}>
          <Map size={20} color={Colors.primary} />
        </TouchableOpacity>
        */}
      </View>
      
      {!hasLocationPermission && (
        <TouchableOpacity onPress={handleLocationPermission} style={styles.permissionPrompt}>
          <Text style={styles.permissionText}>
            📍 Enable location to find restaurants near you
          </Text>
        </TouchableOpacity>
      )}
      
      {hasLocationPermission && userLocation && (
        <Text style={styles.locationText}>
          📍 Showing restaurants near you
        </Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={getFilteredRestaurants()}
        renderItem={renderRestaurantCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Map Modal - Temporarily disabled for testing - requires Mapbox token
      <Modal
        visible={showMap}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <RestaurantMap onClose={() => setShowMap(false)} />
      </Modal>
      */}
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
    paddingTop: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  mapButton: {
    padding: Spacing.xs,
  },
  permissionPrompt: {
    padding: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  permissionText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
  },
  locationText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.success,
    marginTop: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  restaurantCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  cuisineType: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  reviewCount: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  statusContainer: {
    padding: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-SemiBold',
  },
  restaurantDetails: {
    padding: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  listContainer: {
    padding: Spacing.lg,
  },
}); 