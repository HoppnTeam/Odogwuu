import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dietary-preferences" />
        <Stack.Screen name="spice-tolerance" />
        <Stack.Screen name="exploration-style" />
        <Stack.Screen name="order-frequency" />
      </Stack>
    </OnboardingProvider>
  );
}