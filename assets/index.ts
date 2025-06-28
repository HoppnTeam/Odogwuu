/**
 * Hoppn Mobile App - Assets Index
 * 
 * Centralized asset exports for easy importing throughout the app.
 * This file provides a single source of truth for all asset paths.
 */

// Logo Assets
export const Logos = {
  main: require('./images/logos/hoppn-logo-main.svg'),
  horizontal: require('./images/logos/hoppn-logo-horizontal.svg'),
  vertical: require('./images/logos/hoppn-logo-vertical.svg'),
  logomark: require('./images/logos/hoppn-logomark.svg'),
  white: require('./images/logos/hoppn-logo-white.svg'),
  black: require('./images/logos/hoppn-logo-black.svg'),
};

// App Icons
export const AppIcons = {
  ios: require('./images/icons/app-icons/icon-1024.png'),
  android: require('./images/icons/app-icons/icon-512.png'),
  favicon16: require('./images/icons/app-icons/favicon-16.png'),
  favicon32: require('./images/icons/app-icons/favicon-32.png'),
  favicon48: require('./images/icons/app-icons/favicon-48.png'),
};

// Country Flags
export const CountryFlags = {
  nigeria: require('./images/icons/country-flags/nigeria.svg'),
  ghana: require('./images/icons/country-flags/ghana.svg'),
  liberia: require('./images/icons/country-flags/liberia.svg'),
  kenya: require('./images/icons/country-flags/kenya.svg'),
  somalia: require('./images/icons/country-flags/somalia.svg'),
  ethiopia: require('./images/icons/country-flags/ethiopia.svg'),
  gambia: require('./images/icons/country-flags/gambia.svg'),
  senegal: require('./images/icons/country-flags/senegal.svg'),
  sudan: require('./images/icons/country-flags/sudan.svg'),
  morocco: require('./images/icons/country-flags/morocco.svg'),
  togo: require('./images/icons/country-flags/togo.svg'),
  sierraLeone: require('./images/icons/country-flags/sierra-leone.svg'),
  southAfrica: require('./images/icons/country-flags/south-africa.svg'),
};

// Onboarding Assets
export const Onboarding = {
  supportRestaurants: require('./images/onboarding/support-restaurants.png'),
};

// Splash Screen Assets
export const Splash = {
  screen: require('./images/splash/splash-screen.png'),
  loadingAnimation: require('./images/splash/loading-animation.gif'),
};

// Pattern Assets
export const Patterns = {
  geometric: require('./images/patterns/african-pattern-1.svg'),
  textile: require('./images/patterns/african-pattern-2.svg'),
  texture: require('./images/patterns/african-texture.png'),
};

// Placeholder Assets
export const Placeholders = {
  dish: require('./images/placeholders/dish-placeholder.png'),
  restaurant: require('./images/placeholders/restaurant-placeholder.png'),
  userAvatar: require('./images/placeholders/user-avatar-placeholder.png'),
};

// Consolidated Assets Export
export const Assets = {
  logos: Logos,
  appIcons: AppIcons,
  flags: CountryFlags,
  onboarding: Onboarding,
  splash: Splash,
  patterns: Patterns,
  placeholders: Placeholders,
};

// Type definitions for TypeScript support
export type LogoAsset = keyof typeof Logos;
export type CountryFlagAsset = keyof typeof CountryFlags;
export type OnboardingAsset = keyof typeof Onboarding;
export type PlaceholderAsset = keyof typeof Placeholders;

export default Assets;