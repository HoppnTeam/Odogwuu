import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Bell, 
  Heart, 
  CircleHelp as HelpCircle, 
  LogOut, 
  ChevronRight, 
  Edit3, 
  X,
  Flame,
  Star,
  RotateCcw,
  Package,
  Settings,
  Award,
  Calendar
} from 'lucide-react-native';
import { Spacing, FontSize } from '@/constants/Spacing';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { userService } from '@/lib/supabase-service';
import { orderService, Order } from '@/lib/order-service';
import { ReviewService } from '@/lib/review-service';
import { CartItem, ReviewFormData } from '@/types';
import ReviewModal from '@/components/ReviewModal';
import { useNotifications } from '@/contexts/NotificationContext';

const ProfileOption = ({ icon: Icon, title, subtitle, onPress, showChevron = true, isLast = false }: {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  isLast?: boolean;
}) => {
  return (
    <TouchableOpacity style={[styles.profileOption, isLast && styles.profileOptionLast]} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, { backgroundColor: Colors.primary + '20' }]}>
          <Icon color={Colors.primary} size={20} />
        </View>
        <View>
          <Text style={[styles.optionTitle, { color: Colors.text.primary }]}>{title}</Text>
          {subtitle && <Text style={[styles.optionSubtitle, { color: Colors.text.secondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight color={Colors.text.secondary} size={20} />}
    </TouchableOpacity>
  );
};

const PreferenceTag = ({ label, icon: Icon }: { label: string; icon: any }) => {
  return (
    <View style={[styles.preferenceTag, { backgroundColor: Colors.primary + '20' }]}>
      <Icon color={Colors.primary} size={16} />
      <Text style={[styles.preferenceTagText, { color: Colors.primary }]}>{label}</Text>
    </View>
  );
};

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
        <Icon color={Colors.primary} size={24} />
      </View>
      <Text style={[styles.statValue, { color: Colors.text.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: Colors.text.secondary }]}>{label}</Text>
    </View>
  );
};

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
    paddingTop: Spacing.xl,
    backgroundColor: Colors.background.primary,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-Bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  preferenceSection: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  preferenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  preferenceTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  preferenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    gap: Spacing.xs,
  },
  preferenceTagText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
  },
  sectionContent: {
    paddingHorizontal: Spacing.lg,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  profileOptionLast: {
    marginBottom: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
  },
  logoutOption: {
    borderColor: Colors.error,
  },
  logoutIcon: {
    backgroundColor: Colors.error + '20',
  },
  logoutText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.error,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  loadingOrders: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  emptyOrders: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyOrdersText: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyOrdersSubtext: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 25,
  },
  browseButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  orderItemLast: {
    marginBottom: 0,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  orderSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  orderTotal: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
  },
  orderActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    gap: Spacing.xs,
  },
  reorderText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.accent + '20',
    borderRadius: 20,
    gap: Spacing.xs,
  },
  reviewText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.accent,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  permissionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  permissionButtonText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.inverse,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
  },
  modalButtonTextPrimary: {
    color: Colors.text.inverse,
  },
  frequencyText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
});

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { clearCart } = useCart();
  const { hasPermission, requestPermission } = useNotifications();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDish, setSelectedDish] = useState<CartItem | null>(null);
  const [reviewType, setReviewType] = useState<'dish' | 'vendor'>('vendor');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadRecentOrders();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const profile = await userService.getCurrentUser();
      setUserProfile(profile);
      
      // If no profile exists, create a default one
      if (!profile && user) {
        const defaultProfile = await userService.upsertUser({
          full_name: user.email?.split('@')[0] || 'User',
          dietary_preferences: ['no-restrictions'],
          spice_tolerance: 3
        });
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const orders = await orderService.getUserOrders();
      setRecentOrders(orders.slice(0, 3)); // Show only 3 most recent
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      // Clear current cart and add items from the order
      clearCart();
      
      // Add items to cart (you'll need to implement this based on your cart structure)
      order.items.forEach(item => {
        // Add item to cart logic here
      });
      
      router.push('/(tabs)/restaurants');
    } catch (error) {
      console.error('Error reordering:', error);
      Alert.alert('Error', 'Failed to reorder. Please try again.');
    }
  };

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOrderItemsSummary = (items: CartItem[]) => {
    if (items.length === 0) return 'No items';
    if (items.length === 1) return items[0].dish_name;
    return `${items[0].dish_name} +${items.length - 1} more`;
  };

  const getOrderTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.base_price * item.quantity), 0);
  };

  const getOrderDisplayId = (order: Order) => {
    return order.hp_order_id || `Order #${order.id.slice(-8)}`;
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              clearCart();
              await signOut();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const handleSaveField = async () => {
    try {
      // Update user profile logic here
      await userService.upsertUser({ [editField]: editValue });
      await loadUserProfile();
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const getSpiceLevelText = (level: number) => {
    const levels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];
    return levels[level - 1] || 'Not specified';
  };

  const getOrderFrequencyText = (frequency: string) => {
    const frequencies: { [key: string]: string } = {
      'daily': 'Daily',
      'weekly': 'Weekly',
      'monthly': 'Monthly',
      'occasionally': 'Occasionally'
    };
    return frequencies[frequency] || 'Not specified';
  };

  const handleReviewOrder = (order: Order, type: 'dish' | 'vendor', dish?: CartItem) => {
    setSelectedOrder(order);
    setSelectedDish(dish || null);
    setReviewType(type);
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (reviewData: ReviewFormData) => {
    try {
      setReviewLoading(true);
      
      if (reviewType === 'dish' && selectedDish) {
        await ReviewService.createDishReview(
          user?.id || '',
          selectedDish.dish_id,
          selectedOrder?.id || '',
          reviewData
        );
      } else if (reviewType === 'vendor' && selectedOrder) {
        await ReviewService.createVendorReview(
          user?.id || '',
          selectedOrder.restaurant_id,
          selectedOrder.id,
          reviewData
        );
      }
      
      setReviewModalVisible(false);
      Alert.alert('Success', 'Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const getReviewModalTitle = () => {
    if (reviewType === 'dish') {
      return `Review ${selectedDish?.dish_name}`;
    }
    return 'Review Restaurant';
  };

  const getReviewModalSubtitle = () => {
    if (reviewType === 'dish') {
      return 'Share your experience with this dish';
    }
    return 'Share your experience with this restaurant';
  };

  const handleNotificationPermission = async () => {
    try {
      await requestPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert('Error', 'Failed to request notification permission.');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.userName}>Please log in</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={{ color: Colors.text.inverse, fontSize: FontSize.xl, fontFamily: 'Montserrat-Bold' }}>
                {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userProfile?.full_name || user?.email || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Edit3 color={Colors.text.inverse} size={20} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard icon={Award} value="12" label="Reviews" />
          <StatCard icon={Flame} value="8" label="Favorites" />
          <StatCard icon={Package} value="15" label="Orders" />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Dietary Preferences</Text>
            </View>
            <View style={styles.preferencesContainer}>
              {(userProfile?.dietary_preferences || ['no-restrictions']).map((pref: string, index: number) => (
                <PreferenceTag key={index} label={pref} icon={Flame} />
              ))}
            </View>
          </View>

          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Spice Tolerance</Text>
            </View>
            <View style={styles.preferencesContainer}>
              <PreferenceTag 
                label={getSpiceLevelText(userProfile?.spice_tolerance || 3)} 
                icon={Flame} 
              />
            </View>
          </View>

          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Order Frequency</Text>
            </View>
            <View style={styles.preferencesContainer}>
              <View style={styles.preferenceTag}>
                <Calendar color={Colors.primary} size={20} />
                <Text style={styles.frequencyText}>
                  {getOrderFrequencyText(userProfile?.order_frequency || 'weekly')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.sectionContent}>
            <ProfileOption
              icon={User}
              title="Personal Information"
              subtitle="Update your details"
              onPress={() => setEditModalVisible(true)}
            />
            
            <ProfileOption
              icon={MapPin}
              title="Pickup Locations"
              subtitle="Manage your preferred pickup spots"
              onPress={() => Alert.alert('Coming Soon', 'Pickup locations feature will be available soon!')}
            />
            
            <ProfileOption
              icon={CreditCard}
              title="Payment Methods"
              subtitle="Cards and payment options"
              onPress={() => Alert.alert('Coming Soon', 'Payment methods feature will be available soon!')}
              isLast={true}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.sectionContent}>
            <ProfileOption
              icon={Bell}
              title="Notifications"
              subtitle="Pickup updates and promotions"
              onPress={() => Alert.alert('Coming Soon', 'Notifications settings will be available soon!')}
            />
            
            <ProfileOption
              icon={Settings}
              title="App Settings"
              subtitle="Customize your experience"
              onPress={() => Alert.alert('Coming Soon', 'App settings will be available soon!')}
            />
            
            <ProfileOption
              icon={Heart}
              title="Favorite Dishes"
              subtitle="Your liked items"
              onPress={() => Alert.alert('Coming Soon', 'Favorites feature will be available soon!')}
              isLast={true}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.sectionContent}>
            <ProfileOption
              icon={HelpCircle}
              title="Help & Support"
              subtitle="FAQs and contact us"
              onPress={() => Alert.alert('Coming Soon', 'Help & Support will be available soon!')}
            />
            
            <TouchableOpacity
              style={[styles.profileOption, styles.logoutOption, styles.profileOptionLast]}
              onPress={handleLogout}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, styles.logoutIcon]}>
                  <LogOut color={Colors.error} size={20} />
                </View>
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/order-tracking')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {ordersLoading ? (
            <View style={styles.loadingOrders}>
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : recentOrders.length === 0 ? (
            <View style={styles.emptyOrders}>
              <Package color={Colors.text.secondary} size={48} />
              <Text style={styles.emptyOrdersText}>No orders yet</Text>
              <Text style={styles.emptyOrdersSubtext}>Start exploring African cuisine!</Text>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push('/(tabs)/restaurants')}
              >
                <Text style={styles.browseButtonText}>Browse Restaurants</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentOrders.map((order, index) => (
              <View key={order.id} style={[styles.orderItem, index === recentOrders.length - 1 && styles.orderItemLast]}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderTitle}>
                    {getOrderDisplayId(order)}
                  </Text>
                  <Text style={styles.orderSubtitle}>
                    {getOrderItemsSummary(order.items)}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatOrderDate(order.created_at)}
                  </Text>
                  <Text style={styles.orderTotal}>
                    ${getOrderTotal(order.items).toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.reorderButton}
                    onPress={() => handleReorder(order)}
                  >
                    <RotateCcw color={Colors.primary} size={16} />
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => handleReviewOrder(order, 'vendor')}
                  >
                    <Star color={Colors.accent} size={16} />
                    <Text style={styles.reviewText}>Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell color={Colors.primary} size={20} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                {hasPermission ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.permissionButton,
                { backgroundColor: hasPermission ? Colors.success : Colors.primary }
              ]}
              onPress={handleNotificationPermission}
            >
              <Text style={styles.permissionButtonText}>
                {hasPermission ? 'Enabled' : 'Enable'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {editField.replace('_', ' ')}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X color={Colors.text.primary} size={24} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField.replace('_', ' ')}`}
              placeholderTextColor={Colors.text.secondary}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveField}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        title={getReviewModalTitle()}
        subtitle={getReviewModalSubtitle()}
        loading={reviewLoading}
      />
    </SafeAreaView>
  );
}