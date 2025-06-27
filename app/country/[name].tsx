import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, MapPin, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { mockDishes, countries } from '@/data/mockData';

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

export default function CountryDishesScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const countryName = name?.charAt(0).toUpperCase() + name?.slice(1);
  
  const country = countries.find(c => c.name.toLowerCase() === name?.toLowerCase());
  const countryDishes = mockDishes.filter(dish => 
    dish.country_origin.toLowerCase() === countryName?.toLowerCase()
  );

  if (!country) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Country not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color={Colors.light.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{country.name} Cuisine</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Country Header */}
        <View style={styles.countryHeader}>
          <Text style={styles.countryFlag}>{country.flag}</Text>
          <Text style={styles.countryName}>{country.name}</Text>
          <Text style={styles.countryDescription}>{country.description}</Text>
        </View>

        {/* Dishes Section */}
        <View style={styles.dishesSection}>
          <View style={styles.sectionHeader}>
            <BookOpen color={Colors.light.primary} size={24} />
            <Text style={styles.sectionTitle}>Traditional Dishes</Text>
          </View>
          
          {countryDishes.length === 0 ? (
            <View style={styles.noDishesContainer}>
              <Text style={styles.noDishesText}>
                No dishes available for {country.name} yet. Check back soon!
              </Text>
            </View>
          ) : (
            countryDishes.map((dish) => (
              <TouchableOpacity
                key={dish.id}
                style={styles.dishCard}
                onPress={() => router.push(`/dish/${dish.id}`)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: dish.image_url }} style={styles.dishImage} />
                
                <View style={styles.dishContent}>
                  <View style={styles.dishHeader}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>${dish.price.toFixed(2)}</Text>
                  </View>
                  
                  <Text style={styles.dishDescription} numberOfLines={2}>
                    {dish.description}
                  </Text>
                  
                  <View style={styles.dishMeta}>
                    <SpiceLevel level={dish.spice_level} />
                    <View style={styles.dishTags}>
                      {dish.is_vegetarian && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>🌱 Vegetarian</Text>
                        </View>
                      )}
                      {dish.is_vegan && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>🌿 Vegan</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {/* Cultural Story Preview */}
                  <View style={styles.storyPreview}>
                    <Text style={styles.storyTitle}>Cultural Story</Text>
                    <Text style={styles.storyText} numberOfLines={3}>
                      {dish.origin_story}
                    </Text>
                    <TouchableOpacity 
                      style={styles.learnMoreButton}
                      onPress={() => router.push(`/dish/${dish.id}`)}
                    >
                      <Text style={styles.learnMoreText}>Learn More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Cultural Information */}
        <View style={styles.culturalSection}>
          <View style={styles.sectionHeader}>
            <MapPin color={Colors.light.primary} size={24} />
            <Text style={styles.sectionTitle}>About {country.name} Cuisine</Text>
          </View>
          
          <View style={styles.culturalCard}>
            <Text style={styles.culturalText}>
              {country.name} cuisine represents centuries of culinary tradition, 
              blending indigenous ingredients with historical influences to create 
              distinctive flavors that tell the story of the region's rich cultural heritage.
            </Text>
            
            <View style={styles.culturalFeatures}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌶️</Text>
                <Text style={styles.featureText}>Bold spices and seasonings</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🥘</Text>
                <Text style={styles.featureText}>Traditional cooking methods</Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌾</Text>
                <Text style={styles.featureText}>Local grains and vegetables</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to taste {country.name}?</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/restaurants')}
          >
            <Text style={styles.ctaButtonText}>Find Restaurants</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border.light,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
  },
  countryHeader: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.light.background.secondary,
  },
  countryFlag: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  countryName: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  countryDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  dishesSection: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginLeft: Spacing.sm,
  },
  noDishesContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noDishesText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
  },
  dishCard: {
    backgroundColor: Colors.light.background.primary,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 200,
  },
  dishContent: {
    padding: Spacing.lg,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  dishName: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
    marginRight: Spacing.sm,
  },
  dishPrice: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.primary,
  },
  dishDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  spiceContainer: {
    flexDirection: 'row',
  },
  chili: {
    fontSize: 16,
    opacity: 0.3,
    marginRight: 2,
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
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.success,
  },
  storyPreview: {
    backgroundColor: Colors.light.background.secondary,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  storyTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  storyText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.primary,
  },
  culturalSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.light.background.secondary,
  },
  culturalCard: {
    backgroundColor: Colors.light.background.primary,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  culturalText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  culturalFeatures: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.text.primary,
  },
  ctaSection: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  ctaTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: Colors.light.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
});