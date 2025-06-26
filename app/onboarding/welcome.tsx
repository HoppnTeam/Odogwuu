import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, Globe, Heart, BookOpen } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

export default function WelcomeOnboardingScreen() {
  const handleContinue = () => {
    router.push('/onboarding/discover');
  };

  const handleSkip = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Welcome to Hoppn</Text>
          <Text style={styles.heroSubtitle}>Your African Culinary Journey Begins Here</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.mainTitle}>Discover. Learn. Taste.</Text>
        <Text style={styles.description}>
          Embark on a flavorful journey through Africa's rich culinary heritage. 
          From traditional recipes to cultural stories, every dish tells a tale.
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Globe color={Colors.primary} size={24} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Explore 12+ Countries</Text>
              <Text style={styles.featureText}>Discover dishes from across Africa</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <BookOpen color={Colors.primary} size={24} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Learn Cultural Stories</Text>
              <Text style={styles.featureText}>Understand the history behind each dish</Text>
            </View>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Heart color={Colors.primary} size={24} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Support Local Restaurants</Text>
              <Text style={styles.featureText}>Easy pickup from nearby African restaurants</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <ArrowRight color={Colors.text.inverse} size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip Introduction</Text>
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
  heroSection: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.xl,
  },
  heroTitle: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  contentSection: {
    flex: 1,
    padding: Spacing.xl,
  },
  mainTitle: {
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  featuresContainer: {
    gap: Spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  featureText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionSection: {
    padding: Spacing.xl,
    gap: Spacing.md,
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
});