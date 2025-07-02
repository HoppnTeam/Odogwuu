import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Modal, ActivityIndicator } from 'react-native';
import OptimizedImage from '@/components/OptimizedImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, Clock, Star, Map, Filter, Search } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useLocation } from '@/contexts/LocationContext';
import { restaurantService, NearbyRestaurant } from '@/lib/restaurant-service';
import { locationService } from '@/lib/location-service';
import RestaurantMap from '@/components/RestaurantMap';

const cuisineTypes = [
  { id: null, name: 'All Cuisines', color: Colors.primary },
  { id: 'West African', name: 'West African', color: '#FF6B4A' },
  { id: 'East African', name: 'East African', color: '#4C8BF5' },
  { id: 'North African', name: 'North African', color: '#FFBF00' },
  { id: 'South African', name: 'South African', color: '#10B981' },
  { id: 'Central African', name: 'Central African', color: '#8B5CF6' },
];

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCuisine, setFilterCuisine] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const getCuisineColor = (cuisineType: string) => {
    const cuisine = cuisineTypes.find(c => c.id === cuisineType);
    return cuisine?.color || Colors.primary;
  };

  const renderRestaurantCard = ({ item }: { item: NearbyRestaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.8}
    >
      <OptimizedImage 
        uri={item.image_url} 
        style={styles.restaurantImage}
        accessibilityLabel={`${item.name} restaurant`}
        accessibilityHint="Double tap to view restaurant details"
      />
      
      <View style={styles.restaurantContent}>
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <View style={styles.cuisineBadge}>
              <Text style={[
                styles.cuisineText,
                { color: getCuisineColor(item.cuisine_type) }
              ]}>
                {item.cuisine_type}
              </Text>
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.restaurantDetails}>
          <View style={styles.detailRow}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.address}
              {item.distance && ` • ${formatDistance(item.distance)} away`}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={14} color={Colors.text.secondary} />
            <Text style={styles.detailText}>
              Ready in {item.pickup_time}
              {item.travelTime && ` • ${item.travelTime} travel`}
            </Text>
          </View>
        </View>

        <View style={styles.restaurantFooter}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.is_open ? Colors.success + '20' : Colors.error + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.is_open ? Colors.success : Colors.error }
            ]}>
              {item.is_open ? '🟢 Open' : '🔴 Closed'}
            </Text>
          </View>
          
          <View style={styles.openingHours}>
            <Text style={styles.openingHoursText}>{item.opening_hours}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCuisineFilter = ({ item }: { item: typeof cuisineTypes[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        filterCuisine === item.id && styles.filterChipActive
      ]}
      onPress={() => setFilterCuisine(item.id)}
    >
      <Text style={[
        styles.filterChipText,
        filterCuisine === item.id && styles.filterChipTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>African Restaurants</Text>
          <Text style={styles.subtitle}>
            Discover authentic African cuisine near you
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setShowFilters(!showFilters)} 
            style={styles.actionButton}
          >
            <Filter size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setShowMap(true)} 
            style={styles.actionButton}
          >
            <Map size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
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
          📍 Showing {getFilteredRestaurants().length} restaurants near you
        </Text>
      )}

      {/* Cuisine Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <FlatList
            data={cuisineTypes}
            renderItem={renderCuisineFilter}
            keyExtractor={(item) => item.id || 'all'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Discovering African restaurants...</Text>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No restaurants found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or location settings
            </Text>
          </View>
        }
      />

      {/* Map Modal */}
      <Modal
        visible={showMap}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <RestaurantMap 
          restaurants={restaurants}
          onClose={() => setShowMap(false)}
          onRestaurantPress={handleRestaurantPress}
        />
      </Modal>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginLeft: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionPrompt: {
    padding: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: 16,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  permissionText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
    lineHeight: 20,
  },
  locationText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.success,
    marginTop: Spacing.sm,
  },
  filtersContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    marginTop: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersList: {
    paddingHorizontal: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  restaurantCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantContent: {
    padding: Spacing.lg,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  cuisineBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  cuisineText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  restaurantDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  restaurantDetails: {
    marginBottom: Spacing.md,
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
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
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
  openingHours: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  openingHoursText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
}); 