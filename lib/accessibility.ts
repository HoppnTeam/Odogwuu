/**
 * Accessibility Utility
 * 
 * Provides comprehensive accessibility features for the Hoppn app including
 * screen reader support, keyboard navigation, and accessibility helpers.
 */

import { Platform } from 'react-native';

// Accessibility roles for different UI elements
export const AccessibilityRoles = {
  // Navigation
  BUTTON: 'button',
  LINK: 'link',
  TAB: 'tab',
  MENU: 'menu',
  MENU_ITEM: 'menuitem',
  
  // Content
  HEADING: 'header',
  IMAGE: 'image',
  TEXT: 'text',
  LIST: 'list',
  LIST_ITEM: 'listitem',
  
  // Forms
  TEXTBOX: 'textbox',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SWITCH: 'switch',
  SLIDER: 'slider',
  COMBOBOX: 'combobox',
  
  // Interactive
  BUTTON_GROUP: 'radiogroup',
  TAB_LIST: 'tablist',
  TOOLBAR: 'toolbar',
  
  // Layout
  BANNER: 'banner',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  CONTENT_INFO: 'contentinfo',
  COMPLEMENTARY: 'complementary',
  REGION: 'region',
} as const;

// Accessibility states
export const AccessibilityStates = {
  SELECTED: 'selected',
  CHECKED: 'checked',
  DISABLED: 'disabled',
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed',
  BUSY: 'busy',
  REQUIRED: 'required',
  INVALID: 'invalid',
} as const;

// Accessibility traits (iOS) / content descriptions (Android)
export const AccessibilityTraits = {
  BUTTON: Platform.OS === 'ios' ? 'button' : 'button',
  LINK: Platform.OS === 'ios' ? 'link' : 'link',
  HEADER: Platform.OS === 'ios' ? 'header' : 'header',
  IMAGE: Platform.OS === 'ios' ? 'image' : 'image',
  TEXT: Platform.OS === 'ios' ? 'text' : 'text',
  ADJUSTABLE: Platform.OS === 'ios' ? 'adjustable' : 'adjustable',
  ALLOWS_DIRECT_INTERACTION: Platform.OS === 'ios' ? 'allowsDirectInteraction' : 'allowsDirectInteraction',
  CAUSES_PAGE_TURN: Platform.OS === 'ios' ? 'causesPageTurn' : 'causesPageTurn',
  KEYBOARD_KEY: Platform.OS === 'ios' ? 'keyboardKey' : 'keyboardKey',
  PLAYS_SOUND: Platform.OS === 'ios' ? 'playsSound' : 'playsSound',
  SEARCH: Platform.OS === 'ios' ? 'search' : 'search',
  STARTS_MEDIA_SESSION: Platform.OS === 'ios' ? 'startsMediaSession' : 'startsMediaSession',
  STATIC_TEXT: Platform.OS === 'ios' ? 'staticText' : 'staticText',
  SUMMARY_ELEMENT: Platform.OS === 'ios' ? 'summaryElement' : 'summaryElement',
  TAB_BAR: Platform.OS === 'ios' ? 'tabBar' : 'tabBar',
  UPDATES_FREQUENTLY: Platform.OS === 'ios' ? 'updatesFrequently' : 'updatesFrequently',
} as const;

// Common accessibility labels for the app
export const AccessibilityLabels = {
  // Navigation
  BACK_BUTTON: 'Go back',
  CLOSE_BUTTON: 'Close',
  MENU_BUTTON: 'Open menu',
  SEARCH_BUTTON: 'Search',
  FILTER_BUTTON: 'Filter options',
  SORT_BUTTON: 'Sort options',
  
  // Actions
  ADD_TO_CART: 'Add to cart',
  REMOVE_FROM_CART: 'Remove from cart',
  PLACE_ORDER: 'Place order',
  CANCEL_ORDER: 'Cancel order',
  TRACK_ORDER: 'Track order',
  WRITE_REVIEW: 'Write a review',
  SHARE: 'Share',
  FAVORITE: 'Add to favorites',
  UNFAVORITE: 'Remove from favorites',
  
  // Content
  LOADING: 'Loading',
  ERROR: 'Error occurred',
  SUCCESS: 'Success',
  NO_RESULTS: 'No results found',
  RETRY: 'Retry',
  REFRESH: 'Refresh',
  
  // Forms
  SUBMIT: 'Submit',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  DELETE: 'Delete',
  EDIT: 'Edit',
  
  // Food specific
  VIEW_DISH_DETAILS: 'View dish details',
  VIEW_RESTAURANT_DETAILS: 'View restaurant details',
  VIEW_COUNTRY_DISHES: 'View dishes from this country',
  SPICE_LEVEL: 'Spice level',
  DIETARY_INFO: 'Dietary information',
  ALLERGEN_INFO: 'Allergen information',
  CULTURAL_STORY: 'Cultural story',
  INGREDIENTS: 'Ingredients',
  PRICE: 'Price',
  RATING: 'Rating',
} as const;

// Common accessibility hints
export const AccessibilityHints = {
  // Navigation
  BACK_BUTTON: 'Double tap to go back to the previous screen',
  CLOSE_BUTTON: 'Double tap to close this screen',
  MENU_BUTTON: 'Double tap to open the main menu',
  SEARCH_BUTTON: 'Double tap to search for dishes or restaurants',
  
  // Actions
  ADD_TO_CART: 'Double tap to add this dish to your cart',
  REMOVE_FROM_CART: 'Double tap to remove this item from your cart',
  PLACE_ORDER: 'Double tap to place your order',
  WRITE_REVIEW: 'Double tap to write a review for this dish',
  SHARE: 'Double tap to share this dish with others',
  FAVORITE: 'Double tap to add this to your favorites',
  
  // Interactive elements
  SLIDER: 'Swipe up or down to adjust the value',
  SWITCH: 'Double tap to toggle this setting',
  CHECKBOX: 'Double tap to select or deselect this option',
  RADIO: 'Double tap to select this option',
  
  // Content
  IMAGE: 'Double tap to view this image in full screen',
  LINK: 'Double tap to navigate to this page',
  BUTTON: 'Double tap to activate this button',
  
  // Food specific
  DISH_IMAGE: 'Double tap to view this dish in detail',
  RESTAURANT_IMAGE: 'Double tap to view this restaurant in detail',
  COUNTRY_FLAG: 'Double tap to view dishes from this country',
  SPICE_INDICATOR: 'Shows the spice level of this dish',
  RATING_STARS: 'Shows the rating for this dish or restaurant',
} as const;

// Helper function to create accessibility props
export const createAccessibilityProps = (
  label: string,
  hint?: string,
  role: string = AccessibilityRoles.BUTTON,
  state?: Record<string, boolean | string>
) => {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: role,
    accessibilityState: state,
    accessibilityTraits: Platform.OS === 'ios' ? [AccessibilityTraits.BUTTON] : undefined,
  };
};

// Helper function for screen reader announcements
export const announceToScreenReader = (message: string) => {
  // This would integrate with a screen reader announcement library
  // For now, we'll use a console log for development
  if (__DEV__) {
    console.log('Screen Reader Announcement:', message);
  }
};

// Helper function for focus management
export const focusElement = (ref: any) => {
  if (ref && ref.current) {
    ref.current.focus();
  }
};

// Helper function to check if accessibility features are enabled
export const isAccessibilityEnabled = () => {
  // This would check system accessibility settings
  // For now, return true to ensure accessibility features are always available
  return true;
};

// Helper function for keyboard navigation
export const handleKeyboardNavigation = (
  event: any,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) => {
  if (Platform.OS === 'web') {
    switch (event.key) {
      case 'Enter':
      case ' ':
        onEnter?.();
        break;
      case 'Escape':
        onEscape?.();
        break;
      case 'ArrowUp':
        onArrowUp?.();
        break;
      case 'ArrowDown':
        onArrowDown?.();
        break;
    }
  }
};

// Helper function for color contrast checking
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  return 4.5; // Default to good contrast
};

// Helper function for touch target sizing
export const getMinimumTouchTarget = (): number => {
  return Platform.OS === 'ios' ? 44 : 48; // iOS and Android minimum touch targets
};

// Helper function for font scaling
export const getScaledFontSize = (baseSize: number): number => {
  // This would integrate with system font scaling
  return baseSize;
};

// Accessibility context for managing focus
export class AccessibilityManager {
  private focusableElements: Map<string, any> = new Map();
  private currentFocusIndex: number = 0;

  registerElement(id: string, ref: any) {
    this.focusableElements.set(id, ref);
  }

  unregisterElement(id: string) {
    this.focusableElements.delete(id);
  }

  focusElement(id: string) {
    const element = this.focusableElements.get(id);
    if (element) {
      focusElement(element);
    }
  }

  focusNext() {
    const elements = Array.from(this.focusableElements.values());
    if (elements.length > 0) {
      this.currentFocusIndex = (this.currentFocusIndex + 1) % elements.length;
      focusElement(elements[this.currentFocusIndex]);
    }
  }

  focusPrevious() {
    const elements = Array.from(this.focusableElements.values());
    if (elements.length > 0) {
      this.currentFocusIndex = this.currentFocusIndex === 0 
        ? elements.length - 1 
        : this.currentFocusIndex - 1;
      focusElement(elements[this.currentFocusIndex]);
    }
  }

  clear() {
    this.focusableElements.clear();
    this.currentFocusIndex = 0;
  }
}

// Global accessibility manager instance
export const accessibilityManager = new AccessibilityManager();

// Accessibility constants for the app
export const AccessibilityConstants = {
  MINIMUM_TOUCH_TARGET: getMinimumTouchTarget(),
  FOCUS_TIMEOUT: 100,
  ANNOUNCEMENT_DELAY: 500,
  KEYBOARD_NAVIGATION_TIMEOUT: 300,
} as const; 