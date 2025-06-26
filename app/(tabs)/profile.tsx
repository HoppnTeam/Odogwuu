import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, MapPin, CreditCard, Bell, Heart, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

const ProfileOption = ({ icon: Icon, title, subtitle, onPress, showChevron = true }: {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}) => (
  <TouchableOpacity style={styles.profileOption} onPress={onPress}>
    <View style={styles.optionLeft}>
      <View style={styles.optionIcon}>
        <Icon color={Colors.primary} size={20} />
      </View>
      <View>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showChevron && <ChevronRight color={Colors.text.secondary} size={20} />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <User color={Colors.text.inverse} size={32} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userEmail}>john.doe@example.com</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileOption
            icon={User}
            title="Personal Information"
            subtitle="Update your details"
            onPress={() => {}}
          />
          
          <ProfileOption
            icon={MapPin}
            title="Delivery Addresses"
            subtitle="Manage your addresses"
            onPress={() => {}}
          />
          
          <ProfileOption
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Cards and payment options"
            onPress={() => {}}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <ProfileOption
            icon={Bell}
            title="Notifications"
            subtitle="Order updates and promotions"
            onPress={() => {}}
          />
          
          <ProfileOption
            icon={Heart}
            title="Favorite Dishes"
            subtitle="Your liked items"
            onPress={() => router.push('/favorites')}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileOption
            icon={HelpCircle}
            title="Help & Support"
            subtitle="FAQs and contact us"
            onPress={() => {}}
          />
          
          <TouchableOpacity
            style={[styles.profileOption, styles.logoutOption]}
            onPress={handleLogout}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, styles.logoutIcon]}>
                <LogOut color={Colors.error} size={20} />
              </View>
              <Text style={[styles.optionTitle, styles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/orders')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderRestaurant}>Mama Africa Kitchen</Text>
              <Text style={styles.orderDetails}>Jollof Rice, Suya • $31.98</Text>
              <Text style={styles.orderDate}>2 days ago</Text>
            </View>
            <View style={styles.orderStatus}>
              <Text style={styles.orderStatusText}>Delivered</Text>
            </View>
          </View>
          
          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderRestaurant}>Ethiopian Spice House</Text>
              <Text style={styles.orderDetails}>Doro Wat, Injera • $23.97</Text>
              <Text style={styles.orderDate}>1 week ago</Text>
            </View>
            <View style={styles.orderStatus}>
              <Text style={styles.orderStatusText}>Delivered</Text>
            </View>
          </View>
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
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  editButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignSelf: 'center',
  },
  editButtonText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.xxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.primary,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
  logoutOption: {
    backgroundColor: Colors.error + '10',
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
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  logoutIcon: {
    backgroundColor: Colors.error + '20',
  },
  optionTitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.primary,
  },
  logoutText: {
    color: Colors.error,
  },
  optionSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginTop: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  orderInfo: {
    flex: 1,
  },
  orderRestaurant: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  orderDetails: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  orderStatus: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: FontSize.xs,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.success,
  },
});