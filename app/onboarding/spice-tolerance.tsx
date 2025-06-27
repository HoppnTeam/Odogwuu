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
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { PreferenceCard } from '@/components/onboarding/PreferenceCard';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { SpiceLevel } from '@/types';

const spiceOptions = [
  { 
    level: 1, 
    icon: '🌶️', 
    title: 'Mild (1)', 
    description: 'I prefer gentle flavors' 
  },
  { 
    level: 2, 
    icon: '🌶️🌶️', 
    title: 'Medium-Low (2)', 
    description: 'A little kick is nice' 
  },
  { 
    level: 3, 
    icon: '🌶️🌶️🌶️', 
    title: 'Medium (3)', 
    description: 'I enjoy some heat' 
  },
  { 
    level: 4, 
    icon: '🌶️🌶️🌶️🌶️', 
    title: 'Hot (4)', 
    description: 'Bring on the spice!' 
  },
  { 
    level: 5, 
    icon: '🌶️🌶️🌶️🌶️🌶️', 
    title: 'Extra Hot (5)', 
    description: 'I live for the burn!' 
  },
];

export default function SpiceToleranceScreen() {
  const { onboardingData, updateOnboardingData, currentStep } = useOnboarding();
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel>(
    onboardingData.spiceLevel || 3
  );

  const handleSpiceLevelSelect = (level: SpiceLevel) => {
    setSelectedSpiceLevel(level);
  };

  const handleNext = () => {
    updateOnboardingData({ spiceLevel: selectedSpiceLevel });
    router.push('/onboarding/exploration-style');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    updateOnboardingData({ spiceLevel: 3 }); // Default to medium
    router.push('/onboarding/exploration-style');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      <OnboardingProgress 
        currentStep={currentStep} 
        totalSteps={5} 
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={Colors.light.text.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            How Adventurous Are You With Spice?
          </Text>
          <Text style={styles.subtitle}>
            From mild to fire - we'll match your heat level
          </Text>
        </View>

        {/* Visual Spice Scale */}
        <View style={styles.spiceScaleSection}>
          <View style={styles.spiceScale}>
            {spiceOptions.map((option, index) => (
              <View key={option.level} style={styles.spiceLevel}>
                <Text style={styles.spiceIcon}>{option.icon}</Text>
                <Text style={styles.spiceNumber}>{option.level}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {spiceOptions.map((option) => (
            <PreferenceCard
              key={option.level}
              icon={option.icon}
              title={option.title}
              description={option.description}
              isSelected={selectedSpiceLevel === option.level}
              onPress={() => handleSpiceLevelSelect(option.level)}
            />
          ))}
        </View>

        {/* Note */}
        <View style={styles.noteSection}>
          <Text style={styles.noteText}>
            🔥 You can adjust this as you explore different dishes
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
          <ArrowRight color={Colors.light.text.inverse} size={20} />
        </TouchableOpacity>
      </View>
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
    color: Colors.light.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  spiceScaleSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  spiceScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
  },
  spiceLevel: {
    alignItems: 'center',
    flex: 1,
  },
  spiceIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  spiceNumber: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
  },
  optionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  noteSection: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  noteText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.light.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border.light,
    gap: Spacing.md,
  },
  skipButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.light.text.secondary,
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: Colors.light.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    marginRight: Spacing.sm,
  },
}); 