/**
 * Image Optimization and Caching Utility
 * 
 * Provides optimized image loading, caching, and performance features for the Hoppn app.
 * Includes progressive loading, error handling, and memory management.
 */

import { Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Types
export interface ImageCacheEntry {
  uri: string;
  localPath: string;
  timestamp: number;
  size: number;
  width: number;
  height: number;
}

export interface OptimizedImageProps {
  uri: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  placeholder?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

// Configuration
const CACHE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
const CACHE_EXPIRY_DAYS = 7;
const IMAGE_QUALITY = 0.8;
const PROGRESSIVE_QUALITY_STEPS = [0.1, 0.3, 0.6, 1.0];

// Cache management
class ImageCache {
  private cache: Map<string, ImageCacheEntry> = new Map();
  private cacheDir: string;

  constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}hoppn-images/`;
    this.initCache();
  }

  private async initCache() {
    try {
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      await this.loadCacheFromStorage();
    } catch (error) {
      console.warn('Failed to initialize image cache:', error);
    }
  }

  private async loadCacheFromStorage() {
    try {
      const cached = await AsyncStorage.getItem('hoppn-image-cache');
      if (cached) {
        const entries = JSON.parse(cached);
        this.cache = new Map(Object.entries(entries));
      }
    } catch (error) {
      console.warn('Failed to load image cache from storage:', error);
    }
  }

  private async saveCacheToStorage() {
    try {
      const entries = Object.fromEntries(this.cache);
      await AsyncStorage.setItem('hoppn-image-cache', JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save image cache to storage:', error);
    }
  }

  async get(uri: string): Promise<string | null> {
    const entry = this.cache.get(uri);
    if (!entry) return null;

    // Check if file exists and is not expired
    try {
      const fileInfo = await FileSystem.getInfoAsync(entry.localPath);
      if (!fileInfo.exists) {
        this.cache.delete(uri);
        return null;
      }

      const isExpired = Date.now() - entry.timestamp > CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (isExpired) {
        await this.remove(uri);
        return null;
      }

      return entry.localPath;
    } catch (error) {
      this.cache.delete(uri);
      return null;
    }
  }

  async set(uri: string, localPath: string, width: number, height: number): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (!fileInfo.exists) return;

      const entry: ImageCacheEntry = {
        uri,
        localPath,
        timestamp: Date.now(),
        size: fileInfo.size || 0,
        width,
        height,
      };

      this.cache.set(uri, entry);
      await this.saveCacheToStorage();
      await this.cleanupCache();
    } catch (error) {
      console.warn('Failed to cache image:', error);
    }
  }

  async remove(uri: string): Promise<void> {
    const entry = this.cache.get(uri);
    if (entry) {
      try {
        await FileSystem.deleteAsync(entry.localPath);
      } catch (error) {
        // File might not exist, ignore error
      }
      this.cache.delete(uri);
      await this.saveCacheToStorage();
    }
  }

  private async cleanupCache(): Promise<void> {
    const entries = Array.from(this.cache.values());
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);

    if (totalSize > CACHE_SIZE_LIMIT) {
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest entries until under limit
      for (const entry of entries) {
        await this.remove(entry.uri);
        const newTotalSize = Array.from(this.cache.values()).reduce((sum, e) => sum + e.size, 0);
        if (newTotalSize <= CACHE_SIZE_LIMIT * 0.8) break; // Leave 20% buffer
      }
    }
  }

  async clear(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      this.cache.clear();
      await AsyncStorage.removeItem('hoppn-image-cache');
    } catch (error) {
      console.warn('Failed to clear image cache:', error);
    }
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    return {
      count: entries.length,
      totalSize: entries.reduce((sum, entry) => sum + entry.size, 0),
      oldestEntry: Math.min(...entries.map(e => e.timestamp)),
      newestEntry: Math.max(...entries.map(e => e.timestamp)),
    };
  }
}

// Global cache instance
export const imageCache = new ImageCache();

// Image optimization utilities
export const optimizeImageUrl = (
  uri: string,
  width?: number,
  height?: number,
  quality: number = IMAGE_QUALITY,
  format: 'webp' | 'jpeg' | 'png' = 'webp'
): string => {
  if (!uri || uri.startsWith('data:') || uri.startsWith('file:')) {
    return uri;
  }

  // For external URLs, we can't optimize them directly
  // In a real app, you might use a CDN or image optimization service
  return uri;
};

export const getImageDimensions = (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = reject;
    image.src = uri;
  });
};

export const downloadAndCacheImage = async (
  uri: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Check cache first
    const cachedPath = await imageCache.get(uri);
    if (cachedPath) {
      return cachedPath;
    }

    // Download image
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const localPath = `${imageCache['cacheDir']}${filename}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      localPath,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        onProgress?.(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result) throw new Error('Download failed');

    // Get image dimensions
    const dimensions = await getImageDimensions(uri);
    
    // Cache the image
    await imageCache.set(uri, result.uri, dimensions.width, dimensions.height);

    return result.uri;
  } catch (error) {
    console.error('Failed to download and cache image:', error);
    throw error;
  }
};

// Progressive loading utilities
export const createProgressiveImageUrl = (
  baseUrl: string,
  quality: number
): string => {
  // This would integrate with your image optimization service
  // For now, return the original URL
  return baseUrl;
};

// Memory management
export const preloadImages = async (uris: string[]): Promise<void> => {
  const promises = uris.map(uri => downloadAndCacheImage(uri).catch(() => null));
  await Promise.all(promises);
};

export const clearImageCache = async (): Promise<void> => {
  await imageCache.clear();
};

export const getImageCacheStats = () => {
  return imageCache.getStats();
};

// Platform-specific optimizations
export const getOptimizedImageProps = (
  uri: string,
  targetWidth?: number,
  targetHeight?: number
): OptimizedImageProps => {
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calculate optimal dimensions
  const width = targetWidth || screenWidth;
  const height = targetHeight || (width * 0.75); // 4:3 aspect ratio default

  return {
    uri: optimizeImageUrl(uri, width, height),
    width,
    height,
    quality: IMAGE_QUALITY,
    format: Platform.OS === 'ios' ? 'jpeg' : 'webp',
  };
}; 