import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Image, Switch } from 'react-native';
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
  Save, 
  X,
  Flame,
  Globe,
  Clock,
  Star,
  RotateCcw,
  Package,
  MessageSquare,
  Moon,
  Sun,
  Settings,
  Award,
  Calendar
} from 'lucide-react-native';
import { Spacing, FontSize } from '@/constants/Spacing';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { userService } from '@/lib/supabase-service';
import { orderService, Order } from '@/lib/order-service';
import { ReviewService } from '@/lib/review-service';
import { CartItem, ReviewFormData } from '@/types';
import ReviewModal from '@/components/ReviewModal';

const ProfileOption = ({ icon: Icon, title, subtitle, onPress, showChevron = true, isLast = false }: {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  isLast?: boolean;
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.profileOption, isLast && styles.profileOptionLast]} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Icon color={colors.primary} size={20} />
        </View>
        <View>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight color={colors.text.secondary} size={20} />}
    </TouchableOpacity>
  );
};

const PreferenceTag = ({ label, icon: Icon }: { label: string; icon: any }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.preferenceTag}>
      <Icon color={colors.primary} size={16} />
      <Text style={styles.preferenceTagText}>{label}</Text>
    </View>
  );
};

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon color={colors.primary} size={24} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { addItem } = useCart();
  const { theme, colors, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [userReviews, setUserReviews] = useState<any[]>([]);
  
  // Review modal state
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewType, setReviewType] = useState<'dish' | 'vendor'>('dish');
  const [selectedDish, setSelectedDish] = useState<CartItem | null>(null);

  // Create styles with theme colors
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.lg,
      paddingTop: Spacing.xl,
      backgroundColor: colors.background.primary,
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
      backgroundColor: colors.primary,
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
      color: colors.text.primary,
      marginBottom: Spacing.xs,
    },
    userEmail: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
    },
    editButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: colors.background.secondary,
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
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    statValue: {
      fontSize: FontSize.lg,
      fontFamily: 'Montserrat-Bold',
      color: colors.text.primary,
      marginBottom: Spacing.xs,
    },
    statLabel: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
    },
    section: {
      marginTop: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.text.primary,
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
      color: colors.text.primary,
    },
    preferencesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    preferenceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: 16,
      gap: Spacing.xs,
    },
    preferenceTagText: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.primary,
    },
    noPreferences: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
      fontStyle: 'italic',
    },
    spiceLevelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    spiceLevelText: {
      fontSize: FontSize.md,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.primary,
    },
    frequencyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    frequencyText: {
      fontSize: FontSize.md,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.primary,
    },
    darkModeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.sm,
      borderRadius: 8,
    },
    darkModeContainerActive: {
      backgroundColor: colors.primary + '10',
    },
    darkModeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    darkModeText: {
      fontSize: FontSize.md,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.primary,
    },
    sectionContent: {
      backgroundColor: colors.background.secondary,
      marginHorizontal: Spacing.lg,
      borderRadius: 12,
      overflow: 'hidden',
    },
    profileOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    profileOptionLast: {
      borderBottomWidth: 0,
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
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    optionTitle: {
      fontSize: FontSize.md,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.text.primary,
      marginBottom: Spacing.xs,
    },
    optionSubtitle: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
    },
    logoutOption: {
      borderBottomWidth: 0,
    },
    logoutIcon: {
      backgroundColor: colors.error + '20',
    },
    logoutText: {
      fontSize: FontSize.md,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.error,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    seeAll: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-SemiBold',
      color: colors.primary,
    },
    loadingOrders: {
      alignItems: 'center',
      padding: Spacing.xl,
    },
    loadingText: {
      fontSize: FontSize.md,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
    },
    emptyOrders: {
      alignItems: 'center',
      padding: Spacing.xl,
    },
    emptyOrdersText: {
      fontSize: FontSize.lg,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.text.primary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    emptyOrdersSubtext: {
      fontSize: FontSize.md,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    browseButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    browseButtonText: {
      fontSize: FontSize.md,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.text.inverse,
    },
    orderItem: {
      padding: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    orderItemLast: {
      borderBottomWidth: 0,
    },
    orderInfo: {
      marginBottom: Spacing.sm,
    },
    orderTitle: {
      fontSize: FontSize.md,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.text.primary,
      marginBottom: Spacing.xs,
    },
    orderDate: {
      fontSize: FontSize.xs,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.secondary,
    },
    orderTotal: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.primary,
    },
    orderActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    reorderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      padding: Spacing.sm,
      borderRadius: 8,
      gap: Spacing.xs,
    },
    reorderText: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.primary,
    },
    reviewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent + '20',
      padding: Spacing.sm,
      borderRadius: 8,
      gap: Spacing.xs,
    },
    reviewText: {
      fontSize: FontSize.sm,
      fontFamily: 'OpenSans-Regular',
      color: colors.accent,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: colors.background.primary,
      borderRadius: 12,
      padding: Spacing.lg,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
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
      color: colors.text.primary,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: 8,
      padding: Spacing.md,
      fontSize: FontSize.md,
      fontFamily: 'OpenSans-Regular',
      color: colors.text.primary,
      backgroundColor: colors.background.secondary,
      marginBottom: Spacing.lg,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.secondary,
    },
    modalButtonText: {
      fontSize: FontSize.md,
      fontFamily: 'Montserrat-SemiBold',
      color: colors.text.primary,
    },
    modalButtonPrimary: {
      backgroundColor: colors.primary,
    },
    modalButtonTextPrimary: {
      color: colors.text.inverse,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.primary,
    },
  });

  useEffect(() => {
    loadUserProfile();
    loadRecentOrders();
    loadUserReviews();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getCurrentUser();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentOrders = async () => {
    if (!user) return;
    
    try {
      setOrdersLoading(true);
      const orders = await orderService.getUserOrders();
      setRecentOrders(orders.slice(0, 3));
    } catch (error) {
      console.error('Error loading recent orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadUserReviews = async () => {
    try {
      if (user?.id) {
        const reviews = await ReviewService.getUserReviews(user.id);
        setUserReviews(reviews || []);
      }
    } catch (error) {
      console.error('Error loading user reviews:', error);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      for (const item of order.items) {
        const mockDish = {
          id: item.dish_id,
          name: item.dish_name,
          restaurant_id: item.restaurant_id,
          image_url: item.image_url,
          base_price: item.base_price,
          description: '',
          category: '',
          base_spice_level: 3,
          country_origin: 'Nigeria',
          country_flag: '🇳🇬',
          origin_story: '',
          base_ingredients: [],
          is_vegetarian: false,
          is_vegan: false,
          is_active: true,
          created_at: '',
          updated_at: ''
        };

        await addItem(mockDish, item.quantity, {
          special_instructions: item.special_instructions,
          preparation_notes: item.preparation_notes,
          spice_level: item.spice_level,
          allergen_triggers: item.allergen_triggers,
          extras: item.extras,
        });
      }

      Alert.alert(
        'Order Added to Cart',
        'Your previous order has been added to your cart. You can review and modify items before placing the order.',
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { 
            text: 'Go to Cart', 
            onPress: () => router.push('/(tabs)/cart')
          }
        ]
      );
    } catch (error) {
      console.error('Error reordering:', error);
      Alert.alert('Error', 'Failed to add order to cart. Please try again.');
    }
  };

  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getOrderItemsSummary = (items: CartItem[]) => {
    const itemNames = items.map(item => item.dish_name);
    if (itemNames.length <= 2) {
      return itemNames.join(', ');
    }
    return `${itemNames[0]}, ${itemNames[1]} +${itemNames.length - 2} more`;
  };

  const getOrderTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      let itemTotal = item.base_price * item.quantity;
      if (item.extras && item.extras.length > 0) {
        itemTotal += item.extras.length * 2; // $2 per extra
      }
      return total + itemTotal;
    }, 0);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut }
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
    const levels = ['Mild', 'Light', 'Medium', 'Hot', 'Extra Hot'];
    return levels[level - 1] || 'Medium';
  };

  const getOrderFrequencyText = (frequency: string) => {
    const frequencies: { [key: string]: string } = {
      'daily': 'Daily',
      '2-3-times-week': '2-3 times per week',
      'weekly': 'Weekly',
      'bi-weekly': 'Bi-weekly',
      'monthly': 'Monthly'
    };
    return frequencies[frequency] || 'Weekly';
  };

  const handleReviewOrder = (order: Order, type: 'dish' | 'vendor', dish?: CartItem) => {
    setSelectedOrder(order);
    setReviewType(type);
    setSelectedDish(dish || null);
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async (reviewData: ReviewFormData) => {
    if (!selectedOrder || !user) return;
    
    try {
      setReviewLoading(true);
      
      if (reviewType === 'dish' && selectedDish) {
        await ReviewService.createDishReview(
          user.id,
          selectedDish.dish_id,
          selectedOrder.id,
          reviewData
        );
      } else if (reviewType === 'vendor') {
        await ReviewService.createVendorReview(
          user.id,
          selectedOrder.restaurant_id,
          selectedOrder.id,
          reviewData
        );
      }
      
      setReviewModalVisible(false);
      Alert.alert('Success', 'Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const getReviewModalTitle = () => {
    if (reviewType === 'dish' && selectedDish) {
      return `Review ${selectedDish.dish_name}`;
    } else if (reviewType === 'vendor' && selectedOrder) {
      return 'Review Restaurant';
    }
    return 'Write a Review';
  };

  const getReviewModalSubtitle = () => {
    if (reviewType === 'dish' && selectedDish) {
      return `Share your experience with ${selectedDish.dish_name}`;
    } else if (reviewType === 'vendor' && selectedOrder) {
      return `Share your experience with this restaurant`;
    }
    return '';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
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
              <User color={Colors.light.text.inverse} size={32} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userProfile?.full_name || 'User'}
              </Text>
              <Text style={styles.userEmail}>
                {userProfile?.email || user?.email}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Edit3 color={Colors.light.text.inverse} size={20} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard icon={Package} value="24" label="Pickups" />
          <StatCard icon={Star} value="4.8" label="Rating" />
          <StatCard icon={Award} value="12" label="Reviews" />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Preferences</Text>
          
          {/* Dietary Preferences */}
          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Dietary Preferences</Text>
              {editing && (
                <TouchableOpacity onPress={() => handleEditField('dietary_preferences', userProfile?.dietary_preferences?.join(', ') || '')}>
                  <Edit3 color={Colors.light.primary} size={16} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.preferencesContainer}>
              {userProfile?.dietary_preferences?.length > 0 ? (
                userProfile.dietary_preferences.map((pref: string, index: number) => (
                  <PreferenceTag key={index} label={pref} icon={Heart} />
                ))
              ) : (
                <Text style={styles.noPreferences}>No preferences set</Text>
              )}
            </View>
          </View>

          {/* Spice Tolerance */}
          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Spice Tolerance</Text>
              {editing && (
                <TouchableOpacity onPress={() => handleEditField('spice_tolerance', userProfile?.spice_tolerance?.toString() || '3')}>
                  <Edit3 color={Colors.light.primary} size={16} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.spiceLevelContainer}>
              <Flame color={Colors.light.primary} size={20} />
              <Text style={styles.spiceLevelText}>
                {getSpiceLevelText(userProfile?.spice_tolerance || 3)} ({userProfile?.spice_tolerance || 3}/5)
              </Text>
            </View>
          </View>

          {/* Order Frequency */}
          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Order Frequency</Text>
              {editing && (
                <TouchableOpacity onPress={() => handleEditField('order_frequency', userProfile?.order_frequency || 'weekly')}>
                  <Edit3 color={colors.primary} size={16} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.frequencyContainer}>
              <Calendar color={colors.primary} size={20} />
              <Text style={styles.frequencyText}>
                {getOrderFrequencyText(userProfile?.order_frequency || 'weekly')}
              </Text>
            </View>
          </View>

          {/* Dark Mode Toggle */}
          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>Theme</Text>
            </View>
            <View style={[
              styles.darkModeContainer,
              theme === 'dark' && styles.darkModeContainerActive
            ]}>
              <View style={styles.darkModeInfo}>
                {theme === 'dark' ? (
                  <Moon color={colors.primary} size={20} />
                ) : (
                  <Sun color={colors.primary} size={20} />
                )}
                <Text style={styles.darkModeText}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border.light, true: colors.primary }}
                thumbColor={colors.text.inverse}
                ios_backgroundColor={colors.border.light}
              />
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
                  <LogOut color={Colors.light.error} size={20} />
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
              <Package color={Colors.light.text.secondary} size={48} />
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
                    <RotateCcw color={Colors.light.primary} size={16} />
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => handleReviewOrder(order, 'vendor')}
                  >
                    <Star color={Colors.light.accent} size={16} />
                    <Text style={styles.reviewText}>Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
                <X color={Colors.light.text.primary} size={24} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField.replace('_', ' ')}`}
              placeholderTextColor={Colors.light.text.secondary}
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