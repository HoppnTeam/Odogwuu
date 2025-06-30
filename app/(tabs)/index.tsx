import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { countries, mockDishes } from '@/data/mockData';
import { userService } from '@/lib/supabase-service';
import { onboardingService } from '@/lib/onboarding-service';

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

export default function DiscoverScreen() {
  const [personalizedDishes, setPersonalizedDishes] = useState<any[]>([]);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalization = async () => {
      setLoading(true);
      const user = await userService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const { data } = await onboardingService.getOnboardingData(user.id);
        setOnboardingData(data);
        const { dishes } = await onboardingService.getPersonalizedRecommendations(user.id);
        setPersonalizedDishes(dishes || []);
      }
      setLoading(false);
    };
    fetchPersonalization();
  }, []);

  const featuredDishes = personalizedDishes.length > 0 ? personalizedDishes : mockDishes.slice(0, 4);

  const handleCountryPress = (countryName: string) => {
    router.push(`/country/${countryName.toLowerCase()}`);
  };

  // Get user's first name for welcome message
  const getUserFirstName = () => {
    if (currentUser?.full_name) {
      return currentUser.full_name.split(' ')[0];
    }
    return 'there';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome {getUserFirstName()}</Text>
          <Text style={styles.subheading}>
            Discover Authentic African Cuisines
          </Text>
          <Text style={styles.culturalSubheading}>
            Learn about the rich cultural heritage of each dish
          </Text>
          {onboardingData && (
            <Text style={styles.personalizedMsg}>
              Your recommendations are personalized based on your preferences.
            </Text>
          )}
        </View>

        {/* African Countries Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by Country</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countriesScroll}>
            {countries.map((country, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.countryCard,
                  { backgroundColor: getCountryCardColor(index) }
                ]}
                onPress={() => handleCountryPress(country.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryDescription} numberOfLines={2}>
                  {country.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Dishes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Dishes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/restaurants')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            featuredDishes.map((dish) => (
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
                    <Text style={styles.dishPrice}>${dish.base_price?.toFixed(2) ?? ''}</Text>
                    <SpiceLevel level={dish.base_spice_level} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Order?</Text>
          <Text style={styles.ctaSubtitle}>
            Browse our restaurants and start your African culinary journey
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/restaurants')}
          >
            <Text style={styles.ctaButtonText}>Explore Restaurants</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get different Hoppn brand color tints for country cards
const getCountryCardColor = (index: number) => {
  const colors = [
    '#F15029', // Primary orange
    '#FF6B4A', // Orange tint
    '#FF8A6B', // Orange light tint
    '#FFA88C', // Orange very light tint
    '#4C8BF5', // Secondary blue
    '#6B9DFF', // Blue tint
    '#8AB0FF', // Blue light tint
    '#A9C3FF', // Blue very light tint
    '#FFBF00', // Accent yellow
    '#FFCC33', // Yellow tint
    '#FFD966', // Yellow light tint
    '#FFE699', // Yellow very light tint
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    lineHeight: 44,
  },
  subheading: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  culturalSubheading: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  personalizedMsg: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  countriesScroll: {
    paddingHorizontal: Spacing.lg,
  },
  countryCard: {
    width: 160,
    borderRadius: 16,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countryFlag: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  countryName: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  countryDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.inverse,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.9,
  },
  dishCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dishImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
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
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
    lineHeight: 22,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishFlag: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  dishOrigin: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  dishDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
  },
  spiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chili: {
    fontSize: 14,
    opacity: 0.3,
  },
  chiliActive: {
    opacity: 1,
  },
  ctaSection: {
    backgroundColor: Colors.background.secondary,
    margin: Spacing.lg,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
});