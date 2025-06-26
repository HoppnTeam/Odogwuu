import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, ArrowLeft, BookOpen, Globe, Users, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

const culturalFeatures = [
  {
    icon: BookOpen,
    title: 'Origin Stories',
    description: 'Learn the fascinating history behind each dish',
    example: 'Discover how Jollof Rice became a symbol of West African unity',
  },
  {
    icon: Globe,
    title: 'Regional Variations',
    description: 'Explore how dishes evolved across different regions',
    example: 'See how Tagine differs between Morocco and Algeria',
  },
  {
    icon: Users,
    title: 'Cultural Significance',
    description: 'Understand the role of food in African traditions',
    example: 'Learn why Injera represents community in Ethiopian culture',
  },
];

const learningAspects = [
  {
    title: 'Ingredients & Preparation',
    description: 'Traditional methods passed down through generations',
    icon: '🥘',
  },
  {
    title: 'Health Benefits',
    description: 'Nutritional wisdom embedded in ancient recipes',
    icon: '🌿',
  },
  {
    title: 'Celebration & Ceremony',
    description: 'How dishes connect to festivals and life events',
    icon: '🎉',
  },
  {
    title: 'Taste Profiles',
    description: 'Understanding complex flavor combinations',
    icon: '👅',
  },
];

export default function CulturalOnboardingScreen() {
  const handleGetStarted = () => {
    router.replace('/');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <BookOpen color={Colors.primary} size={48} />
          </View>
          <Text style={styles.title}>Learn Cultural Stories</Text>
          <Text style={styles.subtitle}>Every Dish Has a Story to Tell</Text>
        </View>

        {/* Main Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg' }}
            style={styles.mainImage}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageText}>
              "Food is our common ground, a universal experience" - James Beard
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Dive deep into the rich cultural heritage behind every African dish. 
            Learn about traditional preparation methods, historical significance, 
            and the stories that make each meal a cultural experience.
          </Text>
        </View>

        {/* Cultural Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          
          {culturalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <View style={styles.featureIcon}>
                    <IconComponent color={Colors.primary} size={24} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleLabel}>Example:</Text>
                  <Text style={styles.exampleText}>{feature.example}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Learning Aspects */}
        <View style={styles.aspectsSection}>
          <Text style={styles.sectionTitle}>Comprehensive Learning</Text>
          
          <View style={styles.aspectsGrid}>
            {learningAspects.map((aspect, index) => (
              <View key={index} style={styles.aspectCard}>
                <Text style={styles.aspectIcon}>{aspect.icon}</Text>
                <Text style={styles.aspectTitle}>{aspect.title}</Text>
                <Text style={styles.aspectDescription}>{aspect.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sample Story Preview */}
        <View style={styles.storySection}>
          <Text style={styles.storyTitle}>Sample Cultural Story</Text>
          <View style={styles.storyCard}>
            <View style={styles.storyHeader}>
              <Text style={styles.dishName}>Kitfo</Text>
              <Text style={styles.dishOrigin}>🇪🇹 Ethiopia</Text>
            </View>
            <Text style={styles.storyPreview}>
              "Kitfo originated in the Gurage region of southern Ethiopia, where it has been 
              prepared for centuries during special celebrations and religious ceremonies. 
              The name derives from the Ethiopic word 'ketema,' meaning 'to chop finely'..."
            </Text>
            <View style={styles.storyFooter}>
              <Sparkles color={Colors.accent} size={16} />
              <Text style={styles.readMoreText}>Read full story in the app</Text>
            </View>
          </View>
        </View>

        {/* Final CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Begin Your Journey?</Text>
          <Text style={styles.ctaDescription}>
            Start exploring African cuisine with rich cultural context and authentic stories.
          </Text>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Start Exploring</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
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
  imageSection: {
    position: 'relative',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Spacing.lg,
  },
  imageText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.inverse,
    textAlign: 'center',
    fontStyle: 'italic',
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
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
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
  featureDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  exampleContainer: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: 12,
  },
  exampleLabel: {
    fontSize: FontSize.xs,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  exampleText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  aspectsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  aspectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  aspectCard: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  aspectIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  aspectTitle: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  aspectDescription: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  storySection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  storyTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  storyCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dishName: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  dishOrigin: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  storyPreview: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  storyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.accent,
    marginLeft: Spacing.sm,
  },
  ctaSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  ctaDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionSection: {
    padding: Spacing.xl,
  },
  getStartedButton: {
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
  getStartedButtonText: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.inverse,
  },
});