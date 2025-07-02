/**
 * OptimizedImage Component
 * 
 * A high-performance image component with caching, progressive loading,
 * error handling, and accessibility features for the Hoppn app.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { ImageProps } from 'react-native';
import { downloadAndCacheImage, getOptimizedImageProps } from '@/lib/image-optimization';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

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

const { width: screenWidth } = Dimensions.get('window');

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
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Calculate dimensions
  const imageWidth = width || screenWidth;
  const imageHeight = height || (imageWidth * 0.75);

  useEffect(() => {
    if (!uri) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    loadImage();
  }, [uri]);

  const loadImage = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      setProgress(0);

      // Show placeholder first
      if (placeholder) {
        setImageUri(placeholder);
      }

      // Download and cache the image
      const cachedUri = await downloadAndCacheImage(uri, (downloadProgress) => {
        setProgress(downloadProgress);
        onProgress?.(downloadProgress);
      });

      setImageUri(cachedUri);
      setIsLoading(false);

      // Animate the image in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      onLoad?.();
    } catch (error) {
      console.error('Failed to load image:', error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error instanceof Error ? error.message : 'Failed to load image');
    }
  };

  const handleRetry = () => {
    loadImage();
  };

  // Accessibility props
  const accessibilityProps = {
    accessible: true,
    accessibilityLabel: accessibilityLabel || 'Image',
    accessibilityHint: accessibilityHint,
    accessibilityRole,
    accessibilityState: {
      busy: isLoading,
      disabled: hasError,
    },
  };

  if (hasError) {
    return (
      <View
        style={[
          styles.errorContainer,
          { width: imageWidth, height: imageHeight },
          style,
        ]}
        {...accessibilityProps}
        accessibilityLabel="Image failed to load"
        accessibilityHint="Double tap to retry loading the image"
      >
        <View style={styles.errorContent}>
          <View style={styles.errorIcon}>
            <View style={styles.errorIconInner} />
          </View>
          <Animated.Text style={[styles.errorText, { opacity: fadeAnim }]}>
            Image unavailable
          </Animated.Text>
          <Animated.View style={[styles.retryButton, { opacity: fadeAnim }]}>
            <Animated.Text style={styles.retryText} onPress={handleRetry}>
              Tap to retry
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: imageWidth, height: imageHeight }, style]}>
      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          {progressiveLoading && progress > 0 && (
            <Animated.Text style={[styles.progressText, { opacity: fadeAnim }]}>
              {Math.round(progress * 100)}%
            </Animated.Text>
          )}
        </View>
      )}

      {/* Image */}
      {imageUri && (
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="cover"
            onLoad={() => {
              setIsLoading(false);
              onLoad?.();
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
              onError?.('Image failed to load');
            }}
            {...accessibilityProps}
            {...props}
          />
        </Animated.View>
      )}

      {/* Placeholder while loading */}
      {isLoading && !imageUri && placeholder && (
        <Image
          source={{ uri: placeholder }}
          style={[styles.placeholder, { width: imageWidth, height: imageHeight }]}
          resizeMode="cover"
          blurRadius={Platform.OS === 'ios' ? 10 : 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    zIndex: 1,
  },
  progressText: {
    marginTop: Spacing.sm,
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: 'OpenSans-Regular',
  },
  errorContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  errorIconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 16,
  },
  retryText: {
    fontSize: 12,
    color: Colors.text.inverse,
    fontFamily: 'OpenSans-SemiBold',
  },
}); 