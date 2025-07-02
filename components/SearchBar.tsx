import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Animated,
} from 'react-native';
import { Search, X, MapPin, Clock, Star, Filter } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { searchService, SearchSuggestion, SearchFilters } from '@/lib/search-service';
import { useLocation } from '@/contexts/LocationContext';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  style?: any;
}

interface SearchBarState {
  query: string;
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  showSuggestions: boolean;
  recentSearches: string[];
}

export default function SearchBar({
  onSearch,
  onFilterPress,
  placeholder = "Search restaurants, dishes, or cuisines...",
  showSuggestions = true,
  autoFocus = false,
  style
}: SearchBarProps) {
  const [state, setState] = useState<SearchBarState>({
    query: '',
    suggestions: [],
    isLoading: false,
    showSuggestions: false,
    recentSearches: []
  });

  const { userLocation } = useLocation();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load recent searches from storage
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (state.showSuggestions) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [state.showSuggestions]);

  const loadRecentSearches = useCallback(async () => {
    try {
      // In a real app, you'd load from AsyncStorage
      const recent = ['Jollof Rice', 'West African', 'Ethiopian', 'Moroccan'];
      setState(prev => ({ ...prev, recentSearches: recent }));
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  const saveRecentSearch = async (query: string) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      setState(prev => {
        const updated = [trimmedQuery, ...prev.recentSearches.filter(s => s !== trimmedQuery)].slice(0, 5);
        // In a real app, you'd save to AsyncStorage
        return { ...prev, recentSearches: updated };
      });
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleQueryChange = (text: string) => {
    setState(prev => ({ ...prev, query: text, showSuggestions: true }));

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search suggestions
    if (text.trim() && showSuggestions) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 300);
    } else {
      setState(prev => ({ ...prev, suggestions: [], isLoading: false }));
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const suggestions = await searchService.getSearchSuggestions(query);
      setState(prev => ({ ...prev, suggestions, isLoading: false }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    saveRecentSearch(trimmedQuery);
    setState(prev => ({ ...prev, showSuggestions: false }));
    Keyboard.dismiss();
    onSearch(trimmedQuery);
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const handleRecentSearchPress = (search: string) => {
    setState(prev => ({ ...prev, query: search }));
    handleSearch(search);
  };

  const clearSearch = () => {
    setState(prev => ({ 
      ...prev, 
      query: '', 
      suggestions: [], 
      showSuggestions: false 
    }));
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'restaurant':
        return <MapPin size={16} color={Colors.primary} />;
      case 'dish':
        return <Clock size={16} color={Colors.warning} />;
      case 'cuisine':
        return <Star size={16} color={Colors.success} />;
      case 'country':
        return <MapPin size={16} color={Colors.info} />;
      default:
        return <Search size={16} color={Colors.text.secondary} />;
    }
  };

  const getSuggestionColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'restaurant':
        return Colors.primary;
      case 'dish':
        return Colors.warning;
      case 'cuisine':
        return Colors.success;
      case 'country':
        return Colors.info;
      default:
        return Colors.text.secondary;
    }
  };

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionIcon}>
        {getSuggestionIcon(item.type)}
      </View>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionText}>{item.text}</Text>
        <Text style={[styles.suggestionType, { color: getSuggestionColor(item.type) }]}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item)}
      activeOpacity={0.7}
    >
      <Search size={16} color={Colors.text.secondary} />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderSuggestions = () => {
    if (!state.showSuggestions) return null;

    return (
      <Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
        {state.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <>
            {state.suggestions.length > 0 ? (
              <FlatList
                data={state.suggestions}
                renderItem={renderSuggestion}
                keyExtractor={(item, index) => `suggestion-${index}`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  state.query.trim() ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No suggestions found</Text>
                      <Text style={styles.emptySubtext}>Try a different search term</Text>
                    </View>
                  ) : null
                }
              />
            ) : (
              <FlatList
                data={state.recentSearches}
                renderItem={renderRecentSearch}
                keyExtractor={(item, index) => `recent-${index}`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  state.recentSearches.length > 0 ? (
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                  ) : null
                }
              />
            )}
          </>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.text.secondary}
            value={state.query}
            onChangeText={handleQueryChange}
            onSubmitEditing={() => handleSearch(state.query)}
            returnKeyType="search"
            autoFocus={autoFocus}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {state.query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {onFilterPress && (
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <Filter size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {renderSuggestions()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  filterButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginTop: Spacing.xs,
    maxHeight: 300,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  suggestionIcon: {
    marginRight: Spacing.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  suggestionType: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  recentSearchText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
}); 