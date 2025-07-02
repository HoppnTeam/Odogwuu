import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import { X, Sliders, MapPin, Star, Clock, DollarSign } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { SearchFilters } from '@/lib/search-service';

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

const cuisineTypes = [
  'All Cuisines',
  'West African',
  'East African',
  'North African',
  'South African',
  'Central African',
];

const dishCategories = [
  'All Categories',
  'Main Course',
  'Appetizer',
  'Dessert',
  'Beverage',
  'Side Dish',
];

const spiceLevels = [
  { value: 1, label: 'Mild (1)' },
  { value: 2, label: 'Light (2)' },
  { value: 3, label: 'Medium (3)' },
  { value: 4, label: 'Hot (4)' },
  { value: 5, label: 'Very Hot (5)' },
];

const distanceOptions = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 15, label: '15 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
];

const ratingOptions = [
  { value: 4.5, label: '4.5+ Stars' },
  { value: 4.0, label: '4.0+ Stars' },
  { value: 3.5, label: '3.5+ Stars' },
  { value: 3.0, label: '3.0+ Stars' },
];

const sortOptions = [
  { value: 'distance', label: 'Distance', icon: MapPin },
  { value: 'rating', label: 'Rating', icon: Star },
  { value: 'price', label: 'Price', icon: DollarSign },
  { value: 'name', label: 'Name' },
];

export default function AdvancedFilters({
  visible,
  onClose,
  onApply,
  currentFilters,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderChip = (
    label: string,
    value: any,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSwitch = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border.light, true: Colors.primary + '40' }}
        thumbColor={value ? Colors.primary : Colors.text.secondary}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Sliders size={24} color={Colors.primary} />
            <Text style={styles.headerTitle}>Advanced Filters</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Cuisine Type */}
          {renderSection('Cuisine Type', (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {cuisineTypes.map((cuisine) => (
                  <View key={cuisine} style={styles.chipWrapper}>
                    {renderChip(
                      cuisine,
                      cuisine,
                      filters.cuisineType === cuisine,
                      () => updateFilter('cuisineType', cuisine === 'All Cuisines' ? undefined : cuisine)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))}

          {/* Distance */}
          {renderSection('Maximum Distance', (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {distanceOptions.map((option) => (
                  <View key={option.value} style={styles.chipWrapper}>
                    {renderChip(
                      option.label,
                      option.value,
                      filters.maxDistance === option.value,
                      () => updateFilter('maxDistance', option.value)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))}

          {/* Rating */}
          {renderSection('Minimum Rating', (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {ratingOptions.map((option) => (
                  <View key={option.value} style={styles.chipWrapper}>
                    {renderChip(
                      option.label,
                      option.value,
                      filters.minRating === option.value,
                      () => updateFilter('minRating', option.value)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))}

          {/* Sort Options */}
          {renderSection('Sort By', (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {sortOptions.map((option) => (
                  <View key={option.value} style={styles.chipWrapper}>
                    {renderChip(
                      option.label,
                      option.value,
                      filters.sortBy === option.value,
                      () => updateFilter('sortBy', option.value)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))}

          {/* Dish Specific Filters */}
          {renderSection('Dish Category', (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {dishCategories.map((category) => (
                  <View key={category} style={styles.chipWrapper}>
                    {renderChip(
                      category,
                      category,
                      filters.category === category,
                      () => updateFilter('category', category === 'All Categories' ? undefined : category)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))}

          {/* Spice Level */}
          {renderSection('Spice Level', (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {spiceLevels.map((level) => (
                  <View key={level.value} style={styles.chipWrapper}>
                    {renderChip(
                      level.label,
                      level.value,
                      filters.spiceLevel === level.value,
                      () => updateFilter('spiceLevel', level.value)
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          ))}

          {/* Dietary Preferences */}
          {renderSection('Dietary Preferences', (
            <View style={styles.switchSection}>
              {renderSwitch(
                'Vegetarian Only',
                filters.isVegetarian || false,
                (value) => updateFilter('isVegetarian', value)
              )}
              {renderSwitch(
                'Vegan Only',
                filters.isVegan || false,
                (value) => updateFilter('isVegan', value)
              )}
              {renderSwitch(
                'Open Restaurants Only',
                filters.isOpen || false,
                (value) => updateFilter('isOpen', value)
              )}
            </View>
          ))}

          {/* Price Range */}
          {renderSection('Price Range', (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>
                Maximum Price: ${filters.maxPrice || 'No limit'}
              </Text>
              <View style={styles.priceButtons}>
                {[10, 20, 30, 50, 100].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceButton,
                      filters.maxPrice === price && styles.priceButtonSelected
                    ]}
                    onPress={() => updateFilter('maxPrice', price)}
                  >
                    <Text style={[
                      styles.priceButtonText,
                      filters.maxPrice === price && styles.priceButtonTextSelected
                    ]}>
                      ${price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipWrapper: {
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chipSelected: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  chipTextSelected: {
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  switchSection: {
    gap: Spacing.md,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
  },
  priceContainer: {
    gap: Spacing.md,
  },
  priceLabel: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
  },
  priceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  priceButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  priceButtonSelected: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  priceButtonText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  priceButtonTextSelected: {
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.background.primary,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.inverse,
  },
}); 