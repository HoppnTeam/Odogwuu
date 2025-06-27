import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, MapPin, Phone } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { getRestaurantById, getDishesByRestaurant } from '@/data/mockData';

const SpiceLevel = ({ level }: { level: number }) => {
  return (
    <View style={styles.spiceContainer}>
      {[...Array(5)].map((_, index) => (
        <Text key={index} style={[styles.chili, index < level && styles.chiliActive]}>
          🌶️
        </Text>
      ))}
    </View>
  );
};

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const restaurant = getRestaurantById(id!);
  const dishes = getDishesByRestaurant(id!);
  
  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  const categories = ['All', ...Array.from(new Set(dishes.map(dish => dish.category)))];
  const filteredDishes = selectedCategory === 'All' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.image_url }} style={styles.headerImage} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={Colors.light.text.inverse} size={24} />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <Star color={Colors.light.accent} size={20} fill={Colors.light.accent} />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.cuisineType}>{restaurant.cuisine_type}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Clock color={Colors.light.text.secondary} size={16} />
              <Text style={styles.detailText}>Ready in {restaurant.pickup_time}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MapPin color={Colors.light.text.secondary} size={16} />
              <Text style={styles.detailText}>{restaurant.address}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Phone color={Colors.light.text.secondary} size={16} />
              <Text style={styles.detailText}>{restaurant.opening_hours}</Text>
            </View>
          </View>
          
          <View style={[
            styles.statusBadge,
            restaurant.is_open ? styles.statusOpen : styles.statusClosed
          ]}>
            <Text style={[
              styles.statusText,
              restaurant.is_open ? styles.statusTextOpen : styles.statusTextClosed
            ]}>
              {restaurant.is_open ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Menu</Text>
          
          {filteredDishes.map((dish) => (
            <TouchableOpacity
              key={dish.id}
              style={styles.dishCard}
              onPress={() => router.push(`/dish/${dish.id}`)}
            >
              <Image source={{ uri: dish.image_url }} style={styles.dishImage} />
              
              <View style={styles.dishContent}>
                <View style={styles.dishHeader}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <View style={styles.countryInfo}>
                    <Text style={styles.dishFlag}>{dish.country_flag}</Text>
                    <Text style={styles.dishOrigin}>{dish.country_origin}</Text>
                  </View>
                </View>
                
                <Text style={styles.dishDescription} numberOfLines={2}>
                  {dish.description}
                </Text>
                
                <View style={styles.dishFooter}>
                  <Text style={styles.dishPrice}>${dish.price.toFixed(2)}</Text>
                  <SpiceLevel level={dish.spice_level} />
                </View>
                
                <View style={styles.dishTags}>
                  {dish.is_vegetarian && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Vegetarian</Text>
                    </View>
                  )}
                  {dish.is_vegan && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Vegan</Text>
                    </View>
                  )}
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
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: Spacing.lg,
    backgroundColor: Colors.light.background.primary,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  restaurantName: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
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
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  detailsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    marginLeft: Spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  statusOpen: {
    backgroundColor: Colors.light.success + '20',
  },
  statusClosed: {
    backgroundColor: Colors.light.error + '20',
  },
  statusText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
  },
  statusTextOpen: {
    color: Colors.light.success,
  },
  statusTextClosed: {
    color: Colors.light.error,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  categoryChip: {
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.text.secondary,
  },
  categoryChipTextActive: {
    color: Colors.light.text.inverse,
  },
  menuSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  menuTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.lg,
  },
  dishCard: {
    backgroundColor: Colors.light.background.primary,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 150,
  },
  dishContent: {
    padding: Spacing.md,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  dishName: {
    flex: 1,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginRight: Spacing.sm,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishFlag: {
    fontSize: 18,
    marginRight: Spacing.xs,
  },
  dishOrigin: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
  },
  dishDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dishPrice: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.primary,
  },
  spiceContainer: {
    flexDirection: 'row',
  },
  chili: {
    fontSize: 14,
    opacity: 0.3,
  },
  chiliActive: {
    opacity: 1,
  },
  dishTags: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.light.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.success,
  },
});