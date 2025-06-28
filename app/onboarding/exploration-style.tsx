import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ExplorationStyle } from '@/types';

const explorationOptions = [
  { 
    id: 'gentle-explorer', 
    icon: '🔰', 
    title: 'Gentle Explorer', 
    description: 'Start with familiar flavors, similar to what I know' 
  },
  { 
    id: 'cultural-curious', 
    icon: '🌍', 
    title: 'Cultural Curious', 
    description: 'I want to learn about different African regions' 
  },
  { 
    id: 'bold-adventurer', 
    icon: '🚀', 
    title: 'Bold Adventurer', 
    description: 'Surprise me with unique and authentic dishes' 
  },
  { 
    id: 'specific-seeker', 
    icon: '🎯', 
    title: 'Specific Seeker', 
    description: 'I know what I like and want more of it' 
  },
];

export default function ExplorationStyleScreen() {
  const { onboardingData, updateOnboardingData, currentStep } = useOnboarding();
  const [selectedStyle, setSelectedStyle] = useState<ExplorationStyle>(
    (onboardingData.explorationStyle as ExplorationStyle) || 'cultural-curious'
  );

  const handleStyleSelect = (style: ExplorationStyle) => {
    setSelectedStyle(style);
  };

  const handleNext = () => {
    updateOnboardingData({ explorationStyle: selectedStyle });
    router.push('/onboarding/order-frequency');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    updateOnboardingData({ explorationStyle: 'cultural-curious' }); // Default
    router.push('/onboarding/order-frequency');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      {/* <OnboardingProgress 
        currentStep={currentStep} 
        totalSteps={5} 
      /> */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            What&apos;s Your Food Adventure Style?
          </Text>
          <Text style={styles.subtitle}>
            We&apos;ll personalize your experience based on your culinary exploration style
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {/* Temporarily commented out PreferenceCard components */}
          {/* {explorationOptions.map((option) => (
            <PreferenceCard
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              isSelected={selectedStyle === option.id}
              onPress={() => handleStyleSelect(option.id as ExplorationStyle)}
            />
          ))} */}
        </View>

        {/* Explanation */}
        <View style={styles.explanationSection}>
          <Text style={styles.explanationTitle}>What this means:</Text>
          <Text style={styles.explanationText}>
            Your exploration style helps us curate dish recommendations and suggest 
            new cuisines that match your comfort level and curiosity.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  optionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  explanationSection: {
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.md,
  },
  explanationTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  explanationText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  skipButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
  },
}); 