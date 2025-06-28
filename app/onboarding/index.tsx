import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, Heart, Globe, Flame, Clock, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function OnboardingScreen() {
  const { currentStep, updateOnboardingData } = useOnboarding();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference) 
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const handleContinue = () => {
    router.push('/onboarding/dietary-preferences');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress indicator removed - component was deleted */}
      
      <View style={styles.content}>
        <Text style={styles.title}>What brings you to Hoppn?</Text>
        <Text style={styles.subtitle}>Help us personalize your African cuisine journey</Text>
        
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedPreferences.includes('cultural') && styles.optionSelected
            ]}
            onPress={() => handlePreferenceToggle('cultural')}
          >
            <Globe color={Colors.primary} size={24} />
            <Text style={styles.optionTitle}>Cultural Exploration</Text>
            <Text style={styles.optionDescription}>Discover African heritage through food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedPreferences.includes('authentic') && styles.optionSelected
            ]}
            onPress={() => handlePreferenceToggle('authentic')}
          >
            <Star color={Colors.primary} size={24} />
            <Text style={styles.optionTitle}>Authentic Flavors</Text>
            <Text style={styles.optionDescription}>Experience traditional African recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedPreferences.includes('adventure') && styles.optionSelected
            ]}
            onPress={() => handlePreferenceToggle('adventure')}
          >
            <Heart color={Colors.primary} size={24} />
            <Text style={styles.optionTitle}>Culinary Adventure</Text>
            <Text style={styles.optionDescription}>Try new and exciting dishes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedPreferences.includes('community') && styles.optionSelected
            ]}
            onPress={() => handlePreferenceToggle('community')}
          >
            <Flame color={Colors.primary} size={24} />
            <Text style={styles.optionTitle}>Community Connection</Text>
            <Text style={styles.optionDescription}>Support local African restaurants</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedPreferences.length === 0 && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedPreferences.length === 0}
        >
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
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.lg,
  },
  option: {
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: Colors.primary,
  },
  optionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  optionDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.md,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: Colors.border.light,
  },
  continueButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    marginRight: Spacing.sm,
  },
});