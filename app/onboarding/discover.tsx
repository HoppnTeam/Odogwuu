import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft, MapPin, Utensils, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

const featuredDishes = [
  {
    name: 'Jollof Rice',
    country: 'Nigeria',
    flag: '🇳🇬',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
    description: 'Fragrant rice cooked in rich tomato sauce with aromatic spices',
  },
  {
    name: 'Doro Wat',
    country: 'Ethiopia',
    flag: '🇪🇹',
    image: 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg',
    description: 'Traditional chicken stew with berbere spice blend',
  },
  {
    name: 'Tagine',
    country: 'Morocco',
    flag: '🇲🇦',
    image: 'https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg',
    description: 'Slow-cooked lamb with apricots and aromatic spices',
  },
];

export default function DiscoverOnboardingScreen() {
  const handleContinue = () => {
    router.push('/onboarding/support');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Utensils color={Colors.primary} size={48} />
          </View>
          <Text style={styles.title}>Discover Authentic Flavors</Text>
          <Text style={styles.subtitle}>Explore Traditional Dishes from Across Africa</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            From the spicy Jollof rice of West Africa to the aromatic tagines of North Africa, 
            discover a world of flavors that tell the story of a continent's rich culinary heritage.
          </Text>
        </View>

        {/* Featured Dishes */}
        <View style={styles.dishesSection}>
          <Text style={styles.sectionTitle}>Featured Dishes</Text>
          
          {featuredDishes.map((dish, index) => (
            <View key={index} style={styles.dishCard}>
              <Image source={{ uri: dish.image }} style={styles.dishImage} />
              <View style={styles.dishContent}>
                <View style={styles.dishHeader}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <View style={styles.countryInfo}>
                    <Text style={styles.flag}>{dish.flag}</Text>
                    <Text style={styles.country}>{dish.country}</Text>
                  </View>
                </View>
                <Text style={styles.dishDescription}>{dish.description}</Text>
                <View style={styles.dishFooter}>
                  <View style={styles.originInfo}>
                    <MapPin color={Colors.text.secondary} size={16} />
                    <Text style={styles.originText}>Traditional Recipe</Text>
                  </View>
                  <View style={styles.ratingInfo}>
                    <Star color={Colors.accent} size={16} fill={Colors.accent} />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>What You'll Discover</Text>
          
          <View style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>🌍</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>12+ African Countries</Text>
              <Text style={styles.benefitText}>Explore diverse culinary traditions</Text>
            </View>
          </View>

          <View style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>📚</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Rich Cultural Stories</Text>
              <Text style={styles.benefitText}>Learn the history behind each dish</Text>
            </View>
          </View>

          <View style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>🌶️</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Authentic Recipes</Text>
              <Text style={styles.benefitText}>Traditional preparation methods</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight color={Colors.text.inverse} size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary,
    textAlign: 'center',
  },
  descriptionSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  description: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dishesSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  dishCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 120,
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
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  country: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  dishDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  benefitsSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  benefitsTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  benefitText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionSection: {
    padding: Spacing.xl,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: Spacing.sm,
  },
  continueButtonText: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.inverse,
  },
});