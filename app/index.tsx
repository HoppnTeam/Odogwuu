import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeScreen() {
  const { user, tempUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // If user is authenticated and has completed onboarding, go to home
      if (user && !tempUser) {
        router.replace('/(tabs)');
      }
      // If user is in onboarding process, go to onboarding
      else if (tempUser && !tempUser.onboarding_completed) {
        router.replace('/onboarding');
      }
    }
  }, [user, tempUser, loading]);

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg' }}
              style={styles.heroImage}
            />
            <Text style={styles.title}>Welcome to Hoppn</Text>
            <Text style={styles.subtitle}>
              Discover authentic African cuisine and learn about the rich culinary traditions from across the continent
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🍽️</Text>
              <Text style={styles.featureTitle}>Authentic Dishes</Text>
              <Text style={styles.featureText}>Traditional recipes from across Africa</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌍</Text>
              <Text style={styles.featureTitle}>Cultural Stories</Text>
              <Text style={styles.featureText}>Learn the history behind each dish</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureTitle}>Easy Pickup</Text>
              <Text style={styles.featureText}>Order ahead and pick up when ready</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  feature: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  featureText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.lg,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
});