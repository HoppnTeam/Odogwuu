import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CartProvider } from '@/contexts/CartContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dish/[id]" />
        <Stack.Screen name="restaurant/[id]" />
        <Stack.Screen name="country/[name]" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-tracking" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </CartProvider>
  );
}