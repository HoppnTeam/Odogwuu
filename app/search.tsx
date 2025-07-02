import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import SearchBar from '@/components/SearchBar';
import AdvancedFilters from '@/components/AdvancedFilters';
import OptimizedImage from '@/components/OptimizedImage';
import { searchService, SearchFilters, SearchResult } from '@/lib/search-service';
import { Restaurant, Dish } from '@/types';

export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setSearchQuery(query);
      
      const results = await searchService.globalSearch(query, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdvancedFilters = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    if (searchQuery) {
      handleSearch(searchQuery, filters);
    }
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const handleDishPress = (dish: Dish) => {
    router.push(`/dish/${dish.id}`);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'restaurant') {
      const restaurant = item.data as Restaurant;
      return (
        <TouchableOpacity
          style={styles.resultCard}
          onPress={() => handleRestaurantPress(restaurant)}
          activeOpacity={0.8}
        >
          <OptimizedImage 
            uri={restaurant.image_url} 
            style={styles.resultImage}
            accessibilityLabel={`${restaurant.name} restaurant`}
          />
          
          <View style={styles.resultContent}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{restaurant.name}</Text>
              <View style={styles.resultType}>
                <MapPin size={14} color={Colors.primary} />
                <Text style={styles.resultTypeText}>Restaurant</Text>
              </View>
            </View>
            
            <Text style={styles.resultDescription} numberOfLines={2}>
              {restaurant.description}
            </Text>
            
            <View style={styles.resultFooter}>
              <View style={styles.ratingContainer}>
                <Star size={14} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
              
              <View style={styles.cuisineBadge}>
                <Text style={styles.cuisineText}>{restaurant.cuisine_type}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      const dish = item.data as Dish;
      return (
        <TouchableOpacity
          style={styles.resultCard}
          onPress={() => handleDishPress(dish)}
          activeOpacity={0.8}
        >
          <OptimizedImage 
            uri={dish.image_url} 
            style={styles.resultImage}
            accessibilityLabel={`${dish.name} dish`}
          />
          
          <View style={styles.resultContent}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{dish.name}</Text>
              <View style={styles.resultType}>
                <Clock size={14} color={Colors.warning} />
                <Text style={styles.resultTypeText}>Dish</Text>
              </View>
            </View>
            
            <Text style={styles.resultDescription} numberOfLines={2}>
              {dish.description}
            </Text>
            
            <View style={styles.resultFooter}>
              <View style={styles.countryInfo}>
                <Text style={styles.countryFlag}>{dish.country_flag}</Text>
                <Text style={styles.countryText}>{dish.country_origin}</Text>
              </View>
              
              <Text style={styles.priceText}>${dish.base_price?.toFixed(2)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SearchBar
        onSearch={handleSearch}
        onFilterPress={() => setShowAdvancedFilters(true)}
        placeholder="Search restaurants, dishes, or cuisines..."
        autoFocus={true}
        style={styles.searchBar}
      />

      {searchQuery && (
        <Text style={styles.searchResultsText}>
          🔍 Found {searchResults.length} results for "{searchQuery}"
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isSearching && searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search terms or filters
              </Text>
            </View>
          ) : null
        }
      />

      {isSearching && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      <AdvancedFilters
        visible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleAdvancedFilters}
        currentFilters={currentFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginRight: Spacing.xl,
  },
  headerSpacer: {
    width: Spacing.xl,
  },
  searchBar: {
    marginBottom: Spacing.md,
  },
  searchResultsText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
    marginTop: Spacing.sm,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  resultImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  resultContent: {
    flex: 1,
    padding: Spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  resultTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  resultType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultTypeText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  resultDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
  },
  cuisineBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
  },
  cuisineText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: FontSize.sm,
    marginRight: Spacing.xs,
  },
  countryText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  priceText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.primary + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
}); 