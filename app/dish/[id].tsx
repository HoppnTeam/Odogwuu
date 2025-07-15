import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Minus, ShoppingCart, BookOpen, MapPin, Heart, Utensils } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { getDishById } from '@/lib/dishes-service';
import { getHoppnDishById } from '@/lib/hoppn-dishes-service';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/lib/order-service';

const SpiceLevel = ({ level }: { level: number }) => {
  return (
    <View style={styles.spiceContainer}>
      <Text style={styles.spiceLabel}>Spice Level: </Text>
      {[...Array(5)].map((_, index) => (
        <Text key={index} style={[styles.chili, index < level && styles.chiliActive]}>
          🌶️
        </Text>
      ))}
    </View>
  );
};

const EducationalSection = ({ icon: Icon, title, content }: {
  icon: any;
  title: string;
  content: string;
}) => (
  <View style={styles.educationalSection}>
    <View style={styles.educationalHeader}>
      <Icon color={Colors.primary} size={20} />
      <Text style={styles.educationalTitle}>{title}</Text>
    </View>
    <Text style={styles.educationalContent}>{content}</Text>
  </View>
);

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { addItem, state } = useCart();
  const [addError, setAddError] = useState<string | null>(null);
  const [checkingOrder, setCheckingOrder] = useState(false);
  const [dish, setDish] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Move selectedSizeIndex hook to top level, always called
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  useEffect(() => {
    async function fetchDish() {
      setLoading(true);
      // Only query hoppn_dishes
      const foundDish = await getHoppnDishById(id!);
      setDish(foundDish);
      setLoading(false);
    }
    fetchDish();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 32 }} />
      </SafeAreaView>
    );
  }

  if (!dish) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Dish not found</Text>
      </SafeAreaView>
    );
  }

  // Multi-size logic (not needed for hoppn_dishes, but keep for type safety)
  const hasSizes = dish.sizes && Array.isArray(dish.sizes) && dish.sizes.length > 0;
  const selectedSize = hasSizes ? dish.sizes![selectedSizeIndex] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: dish.image_url }} style={styles.headerImage} />
          {/* Multi-sizes badge */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={Colors.text.inverse} size={24} />
          </TouchableOpacity>
        </View>

        {/* Dish Info */}
        <View style={styles.dishInfo}>
          <View style={styles.dishHeader}>
            <Text style={styles.dishName}>{dish.name}</Text>
            <View style={styles.countryInfo}>
              <Text style={styles.flag}>{dish.country_flag}</Text>
              <Text style={styles.origin}>{dish.country_origin}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{dish.description}</Text>
          
          <SpiceLevel level={dish.base_spice_level} />
          
          <View style={styles.tags}>
            {dish.is_vegetarian && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>🌱 Vegetarian</Text>
              </View>
            )}
            {dish.is_vegan && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>🌿 Vegan</Text>
              </View>
            )}
            {dish.calories && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>🔥 {dish.calories} cal</Text>
              </View>
            )}
          </View>
        </View>

        {/* Educational Content */}
        <View style={styles.educationalContainer}>
          <Text style={styles.educationalMainTitle}>Learn About {dish.name}</Text>
          
          {/* Origin & History */}
          <EducationalSection
            icon={BookOpen}
            title="Origin & History"
            content={dish.origin_story}
          />

          {/* Ingredients */}
          {dish.base_ingredients && (
          <View style={styles.educationalSection}>
            <View style={styles.educationalHeader}>
              <Utensils color={Colors.primary} size={20} />
              <Text style={styles.educationalTitle}>Ingredients</Text>
            </View>
            <View style={styles.ingredientsList}>
                {dish.base_ingredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredient}>
                  <Text style={styles.ingredientText}>• {ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
          )}

          {/* Preparation Method */}
          {dish.preparation_method && (
            <EducationalSection
              icon={Utensils}
              title="Preparation"
              content={dish.preparation_method}
            />
          )}

          {/* Native Regions */}
          {dish.native_regions && dish.native_regions.length > 0 && (
            <View style={styles.educationalSection}>
              <View style={styles.educationalHeader}>
                <MapPin color={Colors.primary} size={20} />
                <Text style={styles.educationalTitle}>Native Regions/Variations</Text>
              </View>
              <View style={styles.regionsList}>
                {dish.native_regions.map((region: string, index: number) => (
                  <View key={index} style={styles.regionItem}>
                    <Text style={styles.regionText}>📍 {region}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cultural Significance */}
          {dish.cultural_significance && (
            <EducationalSection
              icon={Heart}
              title="Cultural Significance"
              content={dish.cultural_significance}
            />
          )}

          {/* Taste Profile */}
          {dish.taste_profile && (
            <EducationalSection
              icon={Utensils}
              title="Taste Profile"
              content={dish.taste_profile}
            />
          )}

          {/* Health Benefits */}
          {dish.health_benefits && (
            <EducationalSection
              icon={Heart}
              title="Health Benefits"
              content={dish.health_benefits}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  dishInfo: {
    padding: Spacing.lg,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  dishName: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  countryInfo: {
    alignItems: 'center',
  },
  flag: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  origin: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  price: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  spiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  spiceLabel: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  chili: {
    fontSize: 16,
    opacity: 0.3,
    marginRight: 2,
  },
  chiliActive: {
    opacity: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
  },
  tagText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.success,
  },
  educationalContainer: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
  },
  educationalMainTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  educationalSection: {
    backgroundColor: Colors.background.primary,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  educationalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  educationalTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  educationalContent: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  ingredientsList: {
    gap: Spacing.sm,
  },
  ingredient: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  ingredientText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  regionsList: {
    gap: Spacing.sm,
  },
  regionItem: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.sm,
    borderRadius: 8,
  },
  regionText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  instructionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  instructionsTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  instructionsInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 25,
    paddingHorizontal: Spacing.sm,
  },
  quantityButton: {
    padding: Spacing.sm,
  },
  quantity: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginHorizontal: Spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  addToCartText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  multiSizesBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 10,
  },
  multiSizesBadgeText: {
    color: Colors.text.inverse,
    fontFamily: 'Montserrat-Bold',
    fontSize: FontSize.sm,
  },
  sizeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sizeOption: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  sizeOptionSelected: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  sizeLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  sizeLabelSelected: {
    color: Colors.text.inverse,
  },
  sizePrice: {
    fontFamily: 'OpenSans-Regular',
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
});