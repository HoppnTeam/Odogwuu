import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, MapPin, Clock, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { mockRestaurants } from '@/data/mockData';

export default function RestaurantsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const cuisineTypes = ['All', 'West African', 'East African', 'North African', 'South African'];
  
  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine_type === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>African Restaurants</Text>
          <Text style={styles.subtitle}>Discover authentic cuisine for pickup</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color={Colors.light.text.secondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or cuisine..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.text.secondary}
          />
        </View>

        {/* Cuisine Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {cuisineTypes.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={[
                styles.filterChip,
                selectedCuisine === cuisine && styles.filterChipActive
              ]}
              onPress={() => setSelectedCuisine(cuisine)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterChipText,
                selectedCuisine === cuisine && styles.filterChipTextActive
              ]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map Placeholder */}
        <TouchableOpacity style={styles.mapPlaceholder} activeOpacity={0.8}>
          <MapPin color={Colors.light.primary} size={24} />
          <Text style={styles.mapText}>View on Map</Text>
          <Text style={styles.mapSubtext}>See restaurant locations</Text>
        </TouchableOpacity>

        {/* Restaurant List */}
        <View style={styles.restaurantList}>
          <Text style={styles.listTitle}>
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </Text>
          
          {filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: restaurant.image_url }} style={styles.restaurantImage} />
              
              <View style={styles.restaurantContent}>
                <View style={styles.restaurantHeader}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star color={Colors.light.accent} size={16} fill={Colors.light.accent} />
                    <Text style={styles.rating}>{restaurant.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.cuisineType}>{restaurant.cuisine_type}</Text>
                <Text style={styles.restaurantDescription} numberOfLines={2}>
                  {restaurant.description}
                </Text>
                
                <View style={styles.restaurantFooter}>
                  <View style={styles.pickupInfo}>
                    <Clock color={Colors.light.text.secondary} size={14} />
                    <Text style={styles.pickupTime}>Ready in {restaurant.pickup_time}</Text>
                  </View>
                  
                  <View style={[
                    styles.statusBadge,
                    restaurant.is_open ? styles.statusOpen : styles.statusClosed
                  ]}>
                    <Text style={[
                      styles.statusText,
                      restaurant.is_open ? styles.statusTextOpen : styles.statusTextClosed
                    ]}>
                      {restaurant.is_open ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.primary,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 12,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.primary,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.3,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.light.text.inverse,
  },
  mapPlaceholder: {
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 12,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapText: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginTop: Spacing.sm,
  },
  mapSubtext: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    marginTop: Spacing.xs,
  },
  restaurantList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  listTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.md,
  },
  restaurantCard: {
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 16,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  restaurantContent: {
    padding: Spacing.lg,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  restaurantName: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginLeft: Spacing.xs,
  },
  cuisineType: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
  },
  restaurantDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupTime: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    marginLeft: Spacing.xs,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  statusOpen: {
    backgroundColor: Colors.light.success,
  },
  statusClosed: {
    backgroundColor: Colors.light.error,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
  },
  statusTextOpen: {
    color: Colors.light.white,
  },
  statusTextClosed: {
    color: Colors.light.white,
  },
}); 