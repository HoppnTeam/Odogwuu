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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalization = async () => {
      setLoading(true);
      const user = await userService.getCurrentUser();
      if (user) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Discover African Cuisine</Text>
          <Text style={styles.subheading}>
            Explore authentic dishes and learn about their rich cultural heritage
          </Text>
          {onboardingData && (
            <Text style={styles.personalizedMsg}>
              Welcome back{onboardingData.fullName ? `, ${onboardingData.fullName}` : ''}! Your recommendations are personalized.
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
                style={styles.countryCard}
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
            <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginVertical: 20 }} />
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
                    <Text style={styles.dishPrice}>${dish.price?.toFixed(2) ?? ''}</Text>
                    <SpiceLevel level={dish.spice_level} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.primary,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  subheading: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.primary,
  },
  countriesScroll: {
    paddingHorizontal: Spacing.lg,
  },
  countryCard: {
    width: 160,
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginRight: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  countryFlag: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  countryName: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.xs,
  },
  countryDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  dishCard: {
    backgroundColor: Colors.light.background.primary,
    borderRadius: 12,
    marginHorizontal: Spacing.lg,
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
    height: 200,
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
    fontSize: 20,
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
    fontSize: 12,
    opacity: 0.3,
  },
  chiliActive: {
    opacity: 1,
  },
  ctaSection: {
    backgroundColor: Colors.light.background.secondary,
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  ctaSubtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: Colors.light.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  personalizedMsg: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});