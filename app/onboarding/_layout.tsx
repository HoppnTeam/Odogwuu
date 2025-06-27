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
        {/* Keep old screens as backup */}
        <Stack.Screen name="welcome" />
        <Stack.Screen name="discover" />
        <Stack.Screen name="cultural" />
      </Stack>
    </OnboardingProvider>
  );
}