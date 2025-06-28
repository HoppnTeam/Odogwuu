import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CircleCheck as CheckCircle, Clock, Bell, MapPin, Flame, AlertTriangle, Package, MessageSquare, ChefHat } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

const orderStatuses = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, completed: true },
  { id: 'preparing', label: 'Preparing Food', icon: Clock, completed: true },
  { id: 'ready', label: 'Ready for Pickup', icon: Bell, completed: false },
  { id: 'picked_up', label: 'Order Picked Up', icon: CheckCircle, completed: false },
];

export default function OrderTrackingScreen() {
  const [currentStatus, setCurrentStatus] = useState('preparing');
  const [estimatedTime, setEstimatedTime] = useState('10-15 minutes');

  useEffect(() => {
    // Simulate order progress
    const timer = setTimeout(() => {
      if (currentStatus === 'preparing') {
        setCurrentStatus('ready');
        setEstimatedTime('Ready now!');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStatus]);

  const getCurrentStatusIndex = () => {
    return orderStatuses.findIndex(status => status.id === currentStatus);
  };

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <ArrowLeft color={Colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #12345</Text>
          <Text style={styles.restaurantName}>Mama Africa Kitchen</Text>
          <Text style={styles.estimatedTime}>
            {currentStatus === 'ready' ? 'Ready for pickup!' : `Ready in: ${estimatedTime}`}
          </Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.timeline}>
          {orderStatuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const IconComponent = status.icon;

            return (
              <View key={status.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.statusIcon,
                    isCompleted && styles.statusIconCompleted,
                    isCurrent && styles.statusIconCurrent
                  ]}>
                    <IconComponent 
                      color={isCompleted ? Colors.text.inverse : Colors.text.secondary} 
                      size={20} 
                    />
                  </View>
                  {index < orderStatuses.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      isCompleted && styles.timelineLineCompleted
                    ]} />
                  )}
                </View>
                
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.statusLabel,
                    isCompleted && styles.statusLabelCompleted,
                    isCurrent && styles.statusLabelCurrent
                  ]}>
                    {status.label}
                  </Text>
                  
                  {isCurrent && (
                    <Text style={styles.statusTime}>
                      {status.id === 'ready' ? 'Your order is ready! Please come pick it up.' : 'In progress...'}
                    </Text>
                  )}
                  
                  {isCompleted && index < currentStatusIndex && (
                    <Text style={styles.statusTime}>Completed</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Pickup Location */}
        <View style={styles.pickupSection}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <View style={styles.locationCard}>
            <MapPin color={Colors.primary} size={20} />
            <View style={styles.locationContent}>
              <Text style={styles.locationTitle}>Mama Africa Kitchen</Text>
              <Text style={styles.locationText}>1234 University Ave, Minneapolis, MN 55401</Text>
              <Text style={styles.locationHours}>Open until 10:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.orderItems}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          <View style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Jollof Rice</Text>
              <Text style={styles.itemDetails}>🇳🇬 Nigeria • Qty: 1</Text>
              
              {/* Customization Display */}
              <View style={styles.customizationDisplay}>
                <View style={styles.customizationTag}>
                  <Flame color={Colors.primary} size={12} />
                  <Text style={styles.customizationText}>Medium Spice</Text>
                </View>
                <View style={styles.customizationTag}>
                  <AlertTriangle color={Colors.warning} size={12} />
                  <Text style={styles.customizationText}>2 allergens avoided</Text>
                </View>
                <View style={styles.customizationTag}>
                  <Package color={Colors.primary} size={12} />
                  <Text style={styles.customizationText}>1 extra</Text>
                </View>
              </View>

              {/* Special Instructions */}
              <View style={styles.instructionRow}>
                <MessageSquare color={Colors.secondary} size={12} />
                <Text style={styles.instructionText}>Extra spicy, please make it very hot</Text>
              </View>

              {/* Preparation Notes */}
              <View style={styles.instructionRow}>
                <ChefHat color={Colors.secondary} size={12} />
                <Text style={styles.instructionText}>Cook rice until slightly crispy</Text>
              </View>

              {/* Extras Display */}
              <View style={styles.extrasDisplay}>
                <View style={styles.extraDisplay}>
                  <Text style={styles.extraDisplayText}>+ Hot Sauce x1</Text>
                  <Text style={styles.extraDisplayPrice}>+$1.00</Text>
                </View>
              </View>
            </View>
            <Text style={styles.itemPrice}>$17.99</Text>
          </View>
          
          <View style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Suya</Text>
              <Text style={styles.itemDetails}>🇳🇬 Nigeria • Qty: 1</Text>
              
              {/* Customization Display */}
              <View style={styles.customizationDisplay}>
                <View style={styles.customizationTag}>
                  <Flame color={Colors.primary} size={12} />
                  <Text style={styles.customizationText}>Hot Spice</Text>
                </View>
              </View>

              {/* Special Instructions */}
              <View style={styles.instructionRow}>
                <MessageSquare color={Colors.secondary} size={12} />
                <Text style={styles.instructionText}>Extra peanut coating</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>$14.99</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$33.46</Text>
          </View>
        </View>

        {/* Pickup Instructions */}
        {currentStatus === 'ready' && (
          <View style={styles.pickupInstructions}>
            <Text style={styles.sectionTitle}>Pickup Instructions</Text>
            <View style={styles.instructionCard}>
              <Bell color={Colors.primary} size={20} />
              <View style={styles.instructionContent}>
                <Text style={styles.instructionTitle}>Your order is ready!</Text>
                <Text style={styles.instructionText}>
                  Please show this screen or your order number (#12345) to the staff when you arrive.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {currentStatus !== 'picked_up' && (
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Need Help?</Text>
          </TouchableOpacity>
        )}
        
        {currentStatus === 'picked_up' && (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.primaryButtonText}>Order Again</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  orderInfo: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    margin: Spacing.lg,
    borderRadius: 12,
  },
  orderNumber: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  restaurantName: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  estimatedTime: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  timeline: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconCompleted: {
    backgroundColor: Colors.success,
  },
  statusIconCurrent: {
    backgroundColor: Colors.primary,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.border.light,
    marginTop: Spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  statusLabel: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  statusLabelCompleted: {
    color: Colors.success,
  },
  statusLabelCurrent: {
    color: Colors.primary,
  },
  statusTime: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  pickupSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: 12,
  },
  locationContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  locationTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  locationText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  locationHours: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.success,
  },
  orderItems: {
    marginBottom: Spacing.xl,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
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
  pickupInstructions: {
    marginBottom: Spacing.xl,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.success + '10',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  instructionContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  instructionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  instructionText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  supportButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  supportButtonText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  customizationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  customizationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.xs,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  customizationText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  extrasDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  extraDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.xs,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  extraDisplayText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
  },
  extraDisplayPrice: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary,
  },
});