import React, { useState, useEffect } from 'react';
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
import { PreferenceCard } from '@/components/onboarding/PreferenceCard';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { DietaryPreference } from '@/types';

const dietaryOptions = [
  { id: 'vegetarian', icon: '🥗', title: 'Vegetarian', description: 'Plant-based meals' },
  { id: 'vegan', icon: '🌱', title: 'Vegan', description: 'No animal products' },
  { id: 'gluten-free', icon: '🚫', title: 'Gluten-Free', description: 'No wheat, barley, rye' },
  { id: 'nut-allergies', icon: '🥜', title: 'Nut Allergies', description: 'Avoid nuts and seeds' },
  { id: 'halal', icon: '🕌', title: 'Halal', description: 'Islamic dietary guidelines' },
  { id: 'kosher', icon: '✡️', title: 'Kosher', description: 'Jewish dietary laws' },
  { id: 'pescatarian', icon: '🐟', title: 'Pescatarian', description: 'Fish and plant-based' },
  { id: 'dairy-free', icon: '🥛', title: 'Dairy-Free', description: 'No milk products' },
  { id: 'no-restrictions', icon: '❌', title: 'No Restrictions', description: 'I eat everything' },
];

export default function DietaryPreferencesScreen() {
  const { onboardingData, updateOnboardingData, currentStep, setCurrentStep } = useOnboarding();
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>([]);

  // Set the current step to 2 (dietary-preferences is step 2 of 5)
  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handlePreferenceToggle = (preference: DietaryPreference) => {
    if (preference === 'no-restrictions') {
      // If "No Restrictions" is selected, clear all others
      setSelectedPreferences(['no-restrictions']);
    } else {
      // Remove "No Restrictions" if it was selected
      const filtered = selectedPreferences.filter(p => p !== 'no-restrictions');
      
      if (selectedPreferences.includes(preference)) {
        // Remove preference
        setSelectedPreferences(filtered.filter(p => p !== preference));
      } else {
        // Add preference
        setSelectedPreferences([...filtered, preference]);
      }
    }
  };

  const handleNext = () => {
    updateOnboardingData({ dietaryPreferences: selectedPreferences });
    router.push('/onboarding/spice-tolerance');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    updateOnboardingData({ dietaryPreferences: ['no-restrictions'] });
    router.push('/onboarding/spice-tolerance');
  };

  return (
    <SafeAreaView style={styles.container}>
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
            Tell Us About Your Dietary Needs
          </Text>
          <Text style={styles.subtitle}>
            Help us recommend dishes that match your dietary needs and preferences
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          {dietaryOptions.map((option) => (
            <PreferenceCard
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              isSelected={selectedPreferences.includes(option.id as DietaryPreference)}
              onPress={() => handlePreferenceToggle(option.id as DietaryPreference)}
            />
          ))}
        </View>

        {/* Note */}
        <View style={styles.noteSection}>
          <Text style={styles.noteText}>
            💡 I can always change this later in my profile
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
          style={[
            styles.nextButton,
            selectedPreferences.length === 0 && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={selectedPreferences.length === 0}
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
  noteSection: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  noteText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.border.medium,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    marginRight: Spacing.sm,
  },
}); 