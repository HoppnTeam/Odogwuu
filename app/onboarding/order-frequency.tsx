import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OrderFrequency } from '@/types';

const orderFrequencyOptions: { value: OrderFrequency; label: string; description: string }[] = [
  {
    value: 'daily',
    label: 'Daily',
    description: 'I love trying new dishes every day'
  },
  {
    value: '2-3-times-week',
    label: '2-3 times a week',
    description: 'I enjoy regular culinary adventures'
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'I like to plan my food experiences'
  },
  {
    value: 'bi-weekly',
    label: 'Bi-weekly',
    description: 'I prefer occasional special meals'
  },
  {
    value: 'monthly',
    label: 'Monthly',
    description: 'I save it for special occasions'
  }
];

export default function OrderFrequencyScreen() {
  const [selectedFrequency, setSelectedFrequency] = useState<OrderFrequency | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { updateOnboardingData, completeOnboarding, currentStep } = useOnboarding();

  const handleFrequencySelect = (frequency: OrderFrequency) => {
    setSelectedFrequency(frequency);
  };

  const handleBack = () => {
    router.back();
  };

  const handleComplete = async () => {
    if (!selectedFrequency) {
      Alert.alert('Please select your order frequency');
      return;
    }

    setLoading(true);
    try {
      // Update onboarding data with final step
      updateOnboardingData({
        orderFrequency: selectedFrequency,
        completedAt: new Date().toISOString(),
        onboardingVersion: '1.0'
      });

      // Complete onboarding and save to Supabase
      const success = await completeOnboarding();
      
      if (!success) {
        Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>How often do you order food?</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your experience and send relevant recommendations
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.optionsContainer}>
          {orderFrequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedFrequency === option.value && styles.optionCardSelected
              ]}
              onPress={() => handleFrequencySelect(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  selectedFrequency === option.value && styles.optionLabelSelected
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedFrequency === option.value && styles.optionDescriptionSelected
                ]}>
                  {option.description}
                </Text>
              </View>
              
              {selectedFrequency === option.value && (
                <View style={styles.checkIcon}>
                  <Check color={Colors.text.inverse} size={20} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            (!selectedFrequency || loading) && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={!selectedFrequency || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>
            {loading ? 'Completing...' : 'Complete Setup'}
          </Text>
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
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.lg,
    padding: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  optionsContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  optionCard: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderRadius: 12,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: Colors.text.primary,
  },
  checkIcon: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonDisabled: {
    backgroundColor: Colors.border.medium,
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
  },
}); 