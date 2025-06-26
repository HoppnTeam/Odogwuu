import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft, Clock, MapPin, Heart, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

const supportFeatures = [
  {
    icon: Clock,
    title: 'Order Ahead',
    description: 'Place your order and pick it up when ready',
    color: Colors.primary,
  },
  {
    icon: MapPin,
    title: 'Local Restaurants',
    description: 'Support African restaurants in your community',
    color: Colors.secondary,
  },
  {
    icon: Heart,
    title: 'Community Impact',
    description: 'Help preserve cultural traditions through food',
    color: Colors.error,
  },
];

const pickupSteps = [
  {
    step: '1',
    title: 'Browse & Order',
    description: 'Explore dishes and place your order',
  },
  {
    step: '2',
    title: 'Get Notified',
    description: 'Receive notification when food is ready',
  },
  {
    step: '3',
    title: 'Pick Up',
    description: 'Collect your fresh, hot meal',
  },
];

export default function SupportOnboardingScreen() {
  const handleContinue = () => {
    router.push('/onboarding/cultural');
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
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Support Local Restaurants</Text>
            <Text style={styles.heroSubtitle}>Easy Pickup, No Delivery Hassles</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Order ahead and pick up your food when it's ready. Support African restaurants 
            in your community with convenient pickup options that work for everyone.
          </Text>
        </View>

        {/* Support Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Pickup Works Better</Text>
          
          {supportFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <IconComponent color={feature.color} size={24} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* How It Works */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          {pickupSteps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              {index < pickupSteps.length - 1 && <View style={styles.stepConnector} />}
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Benefits for Everyone</Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <CheckCircle color={Colors.success} size={20} />
              <Text style={styles.benefitText}>Fresh, hot food every time</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <CheckCircle color={Colors.success} size={20} />
              <Text style={styles.benefitText}>Support local business owners</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <CheckCircle color={Colors.success} size={20} />
              <Text style={styles.benefitText}>No delivery fees or wait times</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <CheckCircle color={Colors.success} size={20} />
              <Text style={styles.benefitText}>Connect with your community</Text>
            </View>
          </View>
        </View>

        {/* Restaurant Showcase */}
        <View style={styles.showcaseSection}>
          <Text style={styles.showcaseTitle}>Featured Restaurants</Text>
          <View style={styles.restaurantGrid}>
            <View style={styles.restaurantCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
                style={styles.restaurantImage}
              />
              <Text style={styles.restaurantName}>Mama Africa Kitchen</Text>
              <Text style={styles.restaurantCuisine}>West African</Text>
            </View>
            
            <View style={styles.restaurantCard}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg' }}
                style={styles.restaurantImage}
              />
              <Text style={styles.restaurantName}>Ethiopian Spice House</Text>
              <Text style={styles.restaurantCuisine}>East African</Text>
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
    height: 200,
    position: 'relative',
    marginBottom: Spacing.lg,
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
    padding: Spacing.lg,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.inverse,
    opacity: 0.9,
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
  featuresSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
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
  featureDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  stepsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.inverse,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  stepConnector: {
    position: 'absolute',
    left: 15,
    top: 40,
    width: 2,
    height: 40,
    backgroundColor: Colors.border.light,
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
  benefitsList: {
    gap: Spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    padding: Spacing.md,
    borderRadius: 12,
  },
  benefitText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  showcaseSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  showcaseTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  restaurantGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  restaurantCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 80,
  },
  restaurantName: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    padding: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  restaurantCuisine: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
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