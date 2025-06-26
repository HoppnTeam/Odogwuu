import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useCart } from '@/contexts/CartContext';

export default function CartScreen() {
  const { state, removeItem, updateQuantity } = useCart();
  const { items, total } = state;

  const tax = total * 0.08;
  const finalTotal = total + tax;

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
          <View key={item.dish.id} style={styles.cartItem}>
            <Image source={{ uri: item.dish.image_url }} style={styles.itemImage} />
            
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.dish.name}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(item.dish.id)}
                  style={styles.removeButton}
                >
                  <Trash2 color={Colors.error} size={20} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.countryInfo}>
                <Text style={styles.itemFlag}>{item.dish.country_flag}</Text>
                <Text style={styles.itemOrigin}>{item.dish.country_origin}</Text>
              </View>
              
              {item.special_instructions && (
                <Text style={styles.specialInstructions}>
                  Note: {item.special_instructions}
                </Text>
              )}
              
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>${item.dish.price.toFixed(2)}</Text>
                
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}
                    style={styles.quantityButton}
                  >
                    <Minus color={Colors.text.secondary} size={16} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}
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
          <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
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
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
  },
  browseButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
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
    marginBottom: Spacing.xs,
  },
  itemName: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemFlag: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  itemOrigin: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  specialInstructions: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: Spacing.sm,
  },
  quantityButton: {
    padding: Spacing.sm,
  },
  quantity: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginHorizontal: Spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
  },
});