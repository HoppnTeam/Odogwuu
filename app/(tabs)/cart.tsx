import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Edit3, 
  X, 
  Save, 
  Flame, 
  AlertTriangle,
  MessageSquare,
  ChefHat,
  Package
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem, CartExtra, AllergenInfo, SpiceLevelInfo } from '@/types';

// Constants for customization options
const spiceLevels = [
  { level: 1, name: 'Mild', emoji: '🌶️' },
  { level: 2, name: 'Light', emoji: '🌶️🌶️' },
  { level: 3, name: 'Medium', emoji: '🌶️🌶️🌶️' },
  { level: 4, name: 'Hot', emoji: '🌶️🌶️🌶️🌶️' },
  { level: 5, name: 'Extra Hot', emoji: '🌶️🌶️🌶️🌶️🌶️' },
];

const allergens = [
  { id: 'peanuts', name: 'Peanuts' },
  { id: 'tree_nuts', name: 'Tree Nuts' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'soy', name: 'Soy' },
  { id: 'wheat', name: 'Wheat' },
  { id: 'fish', name: 'Fish' },
  { id: 'shellfish', name: 'Shellfish' },
];

const availableExtras = [
  'Extra Rice',
  'Extra Sauce',
  'Side Salad',
  'Plantains',
  'Yam Fries',
  'Extra Meat',
  'Vegetables',
  'Spice Pack',
];

// Mock data for extras and allergens
const allergenInfo: AllergenInfo[] = [
  { id: 'nuts', name: 'Nuts', icon: '🥜', description: 'Tree nuts and peanuts' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', description: 'Milk and dairy products' },
  { id: 'gluten', name: 'Gluten', icon: '🌾', description: 'Wheat and gluten' },
  { id: 'shellfish', name: 'Shellfish', icon: '🦐', description: 'Shellfish and seafood' },
  { id: 'eggs', name: 'Eggs', icon: '🥚', description: 'Eggs and egg products' },
];

const spiceLevelsInfo: SpiceLevelInfo[] = [
  { level: 1, name: 'Mild', description: 'No heat', icon: '🌱' },
  { level: 2, name: 'Light', description: 'Slight warmth', icon: '🌶️' },
  { level: 3, name: 'Medium', description: 'Moderate heat', icon: '🔥' },
  { level: 4, name: 'Hot', description: 'Spicy kick', icon: '🔥🔥' },
  { level: 5, name: 'Extra Hot', description: 'Very spicy', icon: '🔥🔥🔥' },
];

const CustomizationModal = ({ 
  visible, 
  onClose, 
  item, 
  onSave 
}: { 
  visible: boolean; 
  onClose: () => void; 
  item: CartItem; 
  onSave: (customizations: Partial<CartItem>) => void; 
}) => {
  const [spiceLevel, setSpiceLevel] = useState(item.spice_level || 3);
  const [specialInstructions, setSpecialInstructions] = useState(item.special_instructions || '');
  const [preparationNotes, setPreparationNotes] = useState(item.preparation_notes || '');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(item.allergen_triggers || []);
  const [extras, setExtras] = useState<string[]>(item.extras || []);

  const handleSave = () => {
    onSave({
      spice_level: spiceLevel,
      special_instructions: specialInstructions,
      preparation_notes: preparationNotes,
      allergen_triggers: selectedAllergens,
      extras: extras,
    });
    onClose();
  };

  const toggleAllergen = (allergenId: string) => {
    setSelectedAllergens(prev => 
      prev.includes(allergenId) 
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const toggleExtra = (extra: string) => {
    setExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1, padding: 24}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', color: Colors.primary}}>Customize {item.dish_name}</Text>
            <TouchableOpacity onPress={onClose} style={{padding: 8}}>
              <X color={Colors.text.primary} size={28} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            {/* Spice Level */}
            <View style={{marginBottom: 24, backgroundColor: Colors.background.secondary, borderRadius: 16, padding: 16}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 8, color: Colors.text.primary}}>Spice Level</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {spiceLevels.map((level) => (
                  <TouchableOpacity
                    key={level.level}
                    style={{
                      backgroundColor: spiceLevel === level.level ? Colors.primary : Colors.background.primary,
                      borderRadius: 20,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginRight: 6,
                      borderWidth: 1,
                      borderColor: spiceLevel === level.level ? Colors.primary : Colors.border.light,
                      flex: 1,
                      alignItems: 'center',
                      marginLeft: level.level === 1 ? 0 : 4
                    }}
                    onPress={() => setSpiceLevel(level.level)}
                  >
                    <Text style={{color: spiceLevel === level.level ? '#fff' : Colors.text.primary, fontWeight: '600'}}>{level.name}</Text>
                    <Text style={{fontSize: 18}}>{level.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Allergen Triggers */}
            <View style={{marginBottom: 24, backgroundColor: Colors.background.secondary, borderRadius: 16, padding: 16}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 8, color: Colors.text.primary}}>Allergen Triggers</Text>
              <Text style={{fontSize: 14, color: Colors.text.secondary, marginBottom: 8}}>Select allergens to avoid</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {allergens.map((allergen) => (
                  <TouchableOpacity
                    key={allergen.id}
                    style={{
                      backgroundColor: selectedAllergens.includes(allergen.id) ? Colors.warning : Colors.background.primary,
                      borderRadius: 20,
                      paddingVertical: 6,
                      paddingHorizontal: 14,
                      margin: 4,
                      borderWidth: 1,
                      borderColor: selectedAllergens.includes(allergen.id) ? Colors.warning : Colors.border.light,
                    }}
                    onPress={() => toggleAllergen(allergen.id)}
                  >
                    <Text style={{color: selectedAllergens.includes(allergen.id) ? '#fff' : Colors.text.primary, fontWeight: '500'}}>{allergen.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Extras */}
            <View style={{marginBottom: 24, backgroundColor: Colors.background.secondary, borderRadius: 16, padding: 16}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 8, color: Colors.text.primary}}>Extras</Text>
              <Text style={{fontSize: 14, color: Colors.text.secondary, marginBottom: 8}}>Add extra items to your dish</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {availableExtras.map((extra) => (
                  <TouchableOpacity
                    key={extra}
                    style={{
                      backgroundColor: extras.includes(extra) ? Colors.primary : Colors.background.primary,
                      borderRadius: 20,
                      paddingVertical: 6,
                      paddingHorizontal: 14,
                      margin: 4,
                      borderWidth: 1,
                      borderColor: extras.includes(extra) ? Colors.primary : Colors.border.light,
                    }}
                    onPress={() => toggleExtra(extra)}
                  >
                    <Text style={{color: extras.includes(extra) ? '#fff' : Colors.text.primary, fontWeight: '500'}}>{extra}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Special Instructions */}
            <View style={{marginBottom: 24, backgroundColor: Colors.background.secondary, borderRadius: 16, padding: 16}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 8, color: Colors.text.primary}}>Special Instructions</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.background.primary,
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 16,
                  color: Colors.text.primary,
                  minHeight: 48,
                  borderWidth: 1,
                  borderColor: Colors.border.light,
                }}
                placeholder="Any special requests for this dish?"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.text.secondary}
              />
            </View>

            {/* Preparation Notes */}
            <View style={{marginBottom: 24, backgroundColor: Colors.background.secondary, borderRadius: 16, padding: 16}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 8, color: Colors.text.primary}}>Preparation Notes</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.background.primary,
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 16,
                  color: Colors.text.primary,
                  minHeight: 48,
                  borderWidth: 1,
                  borderColor: Colors.border.light,
                }}
                placeholder="How would you like this prepared?"
                value={preparationNotes}
                onChangeText={setPreparationNotes}
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.text.secondary}
              />
            </View>
          </ScrollView>

          <View style={{paddingVertical: 16, alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 30,
                paddingVertical: 16,
                paddingHorizontal: 48,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
                minWidth: 200,
                alignItems: 'center',
              }}
              onPress={handleSave}
            >
              <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>Save Customizations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default function CartScreen() {
  const { state, removeItem, updateQuantity, updateCustomization, getItemTotal } = useCart();
  const { user } = useAuth();
  const { items, total } = state;
  const [customizationModalVisible, setCustomizationModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  const tax = total * 0.08;
  const finalTotal = total + tax;

  const handleCustomize = (item: CartItem) => {
    setSelectedItem(item);
    setCustomizationModalVisible(true);
  };

  const handleSaveCustomization = (customizations: Partial<CartItem>) => {
    if (selectedItem) {
      updateCustomization(selectedItem.dish_id, customizations);
    }
  };

  const getSpiceLevelText = (level: number) => {
    const spiceLevel = spiceLevels.find(sl => sl.level === level);
    return spiceLevel ? spiceLevel.name : 'Medium';
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
        </View>
        
        <View style={styles.emptyCart}>
          <ShoppingBag color={Colors.text.secondary} size={80} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Discover delicious African dishes and add them to your cart
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/restaurants')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image_url }} style={styles.itemImage} />
            
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.dish_name}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => removeItem(item.dish_id)}
                    style={styles.removeButton}
                  >
                    <Trash2 color={Colors.error} size={18} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.customizeRow}>
                <TouchableOpacity
                  onPress={() => handleCustomize(item)}
                  style={styles.customizeButton}
                >
                  <View style={styles.customizeButtonContent}>
                    <Edit3 color={Colors.secondary} size={14} />
                    <Text style={styles.customizeButtonText}>Customize</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.countryInfo}>
                <Text style={styles.itemFlag}>🇳🇬</Text>
                <Text style={styles.itemOrigin}>Nigeria</Text>
              </View>

              {/* Customization Display */}
              <View style={styles.customizationDisplay}>
                {item.spice_level && (
                  <View style={styles.customizationTag}>
                    <Flame color={Colors.primary} size={14} />
                    <Text style={styles.customizationText}>
                      {getSpiceLevelText(item.spice_level)}
                    </Text>
                  </View>
                )}
                
                {item.allergen_triggers && item.allergen_triggers.length > 0 && (
                  <View style={styles.customizationTag}>
                    <AlertTriangle color={Colors.warning} size={14} />
                    <Text style={styles.customizationText}>
                      {item.allergen_triggers.length} allergen{item.allergen_triggers.length !== 1 ? 's' : ''} avoided
                    </Text>
                  </View>
                )}

                {item.extras && item.extras.length > 0 && (
                  <View style={styles.customizationTag}>
                    <Package color={Colors.primary} size={14} />
                    <Text style={styles.customizationText}>
                      {item.extras.length} extra{item.extras.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
              
              {item.special_instructions && (
                <Text style={styles.specialInstructions}>
                  Note: {item.special_instructions}
                </Text>
              )}

              {item.preparation_notes && (
                <Text style={styles.preparationNotes}>
                  Prep: {item.preparation_notes}
                </Text>
              )}

              {/* Extras Display */}
              {item.extras && item.extras.length > 0 && (
                <View style={styles.extrasDisplay}>
                  {item.extras.map((extra, index) => (
                    <View key={index} style={styles.extraDisplay}>
                      <Text style={styles.extraDisplayText}>
                        {extra}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>${Number(item.total_price ?? item.base_price ?? 0).toFixed(2)}</Text>
                
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.dish_id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    <Minus color={Colors.text.secondary} size={16} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.dish_id, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Plus color={Colors.text.secondary} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${Number(total ?? 0).toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${Number(tax ?? 0).toFixed(2)}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${Number(finalTotal ?? 0).toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Customization Modal */}
      {selectedItem && (
        <CustomizationModal
          visible={customizationModalVisible}
          onClose={() => setCustomizationModalVisible(false)}
          item={selectedItem}
          onSave={handleSaveCustomization}
        />
      )}
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
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  itemCount: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  browseButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemContent: {
    flex: 1,
    padding: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemName: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: Spacing.xs,
  },
  customizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  customizeButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  customizeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customizeButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: Spacing.xs,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemFlag: {
    fontSize: FontSize.md,
    marginRight: Spacing.xs,
  },
  itemOrigin: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  customizationDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  customizationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  customizationText: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
    marginLeft: 2,
  },
  specialInstructions: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  preparationNotes: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  extrasDisplay: {
    marginBottom: Spacing.sm,
  },
  extraDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  extraDisplayText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  extraDisplayPrice: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: Colors.background.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  quantity: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginHorizontal: Spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  spiceLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spiceLevelButton: {
    padding: Spacing.xs,
  },
  spiceLevelButtonActive: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  spiceLevelText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  spiceLevelEmoji: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  allergenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenButton: {
    padding: Spacing.xs,
  },
  allergenButtonActive: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  allergenText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  allergenTextActive: {
    fontWeight: 'bold',
  },
  extrasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  extraButton: {
    padding: Spacing.xs,
  },
  extraButtonActive: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  extraText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  extraTextActive: {
    fontWeight: 'bold',
  },
  instructionsInput: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    padding: Spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: 12,
  },
  saveButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
});