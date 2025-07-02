/**
 * AccessibleButton Component
 * 
 * A fully accessible button component with proper touch targets,
 * screen reader support, and keyboard navigation for the Hoppn app.
 */

import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { 
  createAccessibilityProps, 
  AccessibilityRoles, 
  AccessibilityConstants,
  AccessibilityLabels,
  AccessibilityHints,
} from '@/lib/accessibility';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const AccessibleButton = forwardRef<React.ElementRef<typeof TouchableOpacity>, AccessibleButtonProps>(({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = AccessibilityRoles.BUTTON,
  style,
  textStyle,
  testID,
}, ref) => {
  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Get accessibility props
  const getAccessibilityProps = () => {
    const label = accessibilityLabel || title;
    const hint = accessibilityHint || AccessibilityHints.BUTTON;
    
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityRole: accessibilityRole as AccessibilityRole,
      accessibilityState: {
        disabled: isDisabled,
        busy: loading,
      },
    };
  };

  // Get button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      minHeight: AccessibilityConstants.MINIMUM_TOUCH_TARGET,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      flexDirection: 'row',
      paddingHorizontal: Spacing.md,
    };

    // Size variations
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: Spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingVertical: Spacing.md,
        minHeight: 44,
      },
      large: {
        paddingVertical: Spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: isDisabled ? Colors.border.medium : Colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: isDisabled ? Colors.border.medium : Colors.background.secondary,
        borderWidth: 1,
        borderColor: Colors.border.medium,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: isDisabled ? Colors.border.medium : Colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      danger: {
        backgroundColor: isDisabled ? Colors.border.medium : Colors.error,
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  // Get text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: 'Montserrat-SemiBold',
      textAlign: 'center',
    };

    // Size variations
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: FontSize.sm,
      },
      medium: {
        fontSize: FontSize.md,
      },
      large: {
        fontSize: FontSize.lg,
      },
    };

    // Variant styles
    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: Colors.text.inverse,
      },
      secondary: {
        color: isDisabled ? Colors.text.secondary : Colors.text.primary,
      },
      outline: {
        color: isDisabled ? Colors.text.secondary : Colors.primary,
      },
      ghost: {
        color: isDisabled ? Colors.text.secondary : Colors.primary,
      },
      danger: {
        color: Colors.text.inverse,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[getButtonStyles(), style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      {...getAccessibilityProps()}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? Colors.text.inverse : Colors.primary} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Text style={[styles.icon, { marginRight: Spacing.sm }]}>
              {icon}
            </Text>
          )}
          <Text style={[getTextStyles(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Text style={[styles.icon, { marginLeft: Spacing.sm }]}>
              {icon}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  icon: {
    fontSize: 16,
  },
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton; 