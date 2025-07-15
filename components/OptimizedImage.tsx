/**
 * OptimizedImage Component
 * 
 * A simplified image component to avoid Image property conflicts.
 * TODO: Re-implement full optimization features once Image property issue is resolved.
 */

import React from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ImageProps } from 'react-native';
import { Colors } from '@/constants/Colors';

interface OptimizedImageProps extends Omit<ImageProps, 'source' | 'onError' | 'onProgress'> {
  uri: string;
  width?: number;
  height?: number;
  placeholder?: string;
  showLoadingIndicator?: boolean;
  progressiveLoading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'image' | 'button' | 'link';
  onLoad?: () => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export default function OptimizedImage({
  uri,
  width,
  height,
  placeholder,
  showLoadingIndicator = true,
  progressiveLoading = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'image',
  onLoad,
  onError,
  onProgress,
  style,
  ...props
}: OptimizedImageProps) {
  // Calculate dimensions
  const imageWidth = width || 300;
  const imageHeight = height || 200;

  // Accessibility props
  const accessibilityProps = {
    accessible: true,
    accessibilityLabel: accessibilityLabel || 'Image',
    accessibilityHint: accessibilityHint,
    accessibilityRole,
  };

  return (
    <View style={[styles.container, { width: imageWidth, height: imageHeight }, style]}>
      <Image
        source={{ uri: uri || placeholder }}
        style={[styles.image, { width: imageWidth, height: imageHeight }]}
        resizeMode="cover"
        onLoad={onLoad}
        onError={() => onError?.('Failed to load image')}
        {...accessibilityProps}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 