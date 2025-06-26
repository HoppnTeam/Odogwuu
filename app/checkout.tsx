import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, CreditCard, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutScreen() {
  const { state, clearCart } = useCart();
  const { items, total } = state;
  const [selectedPayment, setSelectedPayment] = useState('Card ending in 1234');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const tax = total * 0.08;
  const finalTotal = total + tax;

  const paymentMethods = [
    { id: 'card1', name: 'Card ending in 1234', type: 'Visa' },
    { id: 'card2', name: 'Card ending in 5678', type: 'Mastercard' },
  ];

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Placed!',
      'Your order has been placed successfully. You will receive a notification when it\'s ready for pickup.',
      [
        {
          text: 'Track Order',
          onPress: () => {
            clearCart();
            router.replace('/order-tracking');
          }
        }
      ]
    );
  };

  if (items.length === 0) {
    router.replace('/(tabs)/cart');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pickup Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <View style={styles.pickupCard}>
            <View style={styles.optionLeft}>
              <MapPin color={Colors.primary} size={20} />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Mama Africa Kitchen</Text>
                <Text style={styles.optionSubtitle}>1234 University Ave, Minneapolis, MN</Text>
                <Text style={styles.pickupNote}>Ready for pickup in 15-20 minutes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={[
                styles.optionCard,
                selectedPayment === payment.name && styles.optionCardSelected
              ]}
              onPress={() => setSelectedPayment(payment.name)}
            >
              <View style={styles.optionLeft}>
                <CreditCard color={Colors.primary} size={20} />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{payment.name}</Text>
                  <Text style={styles.optionSubtitle}>{payment.type}</Text>
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedPayment === payment.name && styles.radioButtonSelected
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Add special instructions (optional)"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.text.secondary}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {items.map((item) => (
            <View key={item.dish.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.dish.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.dish.country_flag} {item.dish.country_origin} • Qty: {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.dish.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
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
        </View>

        {/* Estimated Pickup Time */}
        <View style={styles.pickupTime}>
          <Clock color={Colors.primary} size={20} />
          <Text style={styles.pickupTimeText}>
            Estimated pickup time: 15-20 minutes
          </Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>
            Place Order • ${finalTotal.toFixed(2)}
          </Text>
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
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  pickupCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  optionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  pickupNote: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border.medium,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
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
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  itemDetails: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
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
  pickupTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  pickupTimeText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: Colors.text.inverse,
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
  },
});