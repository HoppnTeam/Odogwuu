import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

interface PreferenceCardProps {
  icon: string;
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
}

export function PreferenceCard({ 
  icon, 
  title, 
  description, 
  isSelected, 
  onPress 
}: PreferenceCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            isSelected && styles.titleSelected
          ]}>
            {title}
          </Text>
          <Text style={[
            styles.description,
            isSelected && styles.descriptionSelected
          ]}>
            {description}
          </Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  containerSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  titleSelected: {
    color: Colors.primary,
  },
  description: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  descriptionSelected: {
    color: Colors.text.primary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.text.inverse,
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-Bold',
  },
}); 