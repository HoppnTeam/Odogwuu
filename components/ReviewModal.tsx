import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Star, Flame, Globe, Heart, MessageSquare } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';
import { ReviewFormData } from '@/types';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewFormData) => void;
  title: string;
  subtitle?: string;
  loading?: boolean;
}

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => onRatingChange(star)}
        style={styles.starButton}
      >
        <Star
          color={star <= rating ? Colors.light.accent : Colors.light.border.medium}
          size={24}
          fill={star <= rating ? Colors.light.accent : 'transparent'}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const RatingCategory = ({ 
  title, 
  icon: Icon, 
  rating, 
  onRatingChange, 
  description 
}: { 
  title: string; 
  icon: any; 
  rating: number; 
  onRatingChange: (rating: number) => void;
  description: string;
}) => (
  <View style={styles.ratingCategory}>
    <View style={styles.ratingHeader}>
      <Icon color={Colors.light.primary} size={20} />
      <Text style={styles.ratingTitle}>{title}</Text>
    </View>
    <Text style={styles.ratingDescription}>{description}</Text>
    <StarRating rating={rating} onRatingChange={onRatingChange} />
  </View>
);

export default function ReviewModal({ 
  visible, 
  onClose, 
  onSubmit, 
  title, 
  subtitle, 
  loading = false 
}: ReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [spiceLevelRating, setSpiceLevelRating] = useState(0);
  const [authenticityRating, setAuthenticityRating] = useState(0);
  const [culturalExperienceRating, setCulturalExperienceRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (overallRating === 0) {
      Alert.alert('Rating Required', 'Please provide an overall rating');
      return;
    }

    const reviewData: ReviewFormData = {
      rating: overallRating,
      comment: comment.trim() || undefined,
      spice_level_rating: spiceLevelRating > 0 ? spiceLevelRating : undefined,
      authenticity_rating: authenticityRating > 0 ? authenticityRating : undefined,
      cultural_experience_rating: culturalExperienceRating > 0 ? culturalExperienceRating : undefined,
      overall_experience: overallRating,
    };

    onSubmit(reviewData);
  };

  const handleClose = () => {
    // Reset form
    setOverallRating(0);
    setSpiceLevelRating(0);
    setAuthenticityRating(0);
    setCulturalExperienceRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <X color={Colors.light.text.primary} size={24} />
            </TouchableOpacity>
          </View>

          {subtitle && (
            <Text style={styles.modalSubtitle}>{subtitle}</Text>
          )}

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Overall Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>Overall Rating</Text>
              <StarRating rating={overallRating} onRatingChange={setOverallRating} />
            </View>

            {/* Detailed Ratings */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>Detailed Ratings</Text>
              <Text style={styles.sectionSubtitle}>Rate specific aspects of your experience</Text>
              
              <RatingCategory
                title="Spice Level"
                icon={Flame}
                rating={spiceLevelRating}
                onRatingChange={setSpiceLevelRating}
                description="How well did the spice level match your preferences?"
              />

              <RatingCategory
                title="Authenticity"
                icon={Globe}
                rating={authenticityRating}
                onRatingChange={setAuthenticityRating}
                description="How authentic did the dish taste compared to traditional preparation?"
              />

              <RatingCategory
                title="Cultural Experience"
                icon={Heart}
                rating={culturalExperienceRating}
                onRatingChange={setCulturalExperienceRating}
                description="How much did you learn about the cultural significance?"
              />
            </View>

            {/* Comment */}
            <View style={styles.commentSection}>
              <View style={styles.commentHeader}>
                <MessageSquare color={Colors.light.primary} size={20} />
                <Text style={styles.sectionTitle}>Share Your Experience</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Tell us about your dining experience (optional)</Text>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Share your thoughts about the food, service, cultural experience..."
                placeholderTextColor={Colors.light.text.secondary}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {comment.length}/500 characters
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, overallRating === 0 && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading || overallRating === 0}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background.primary,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border.light,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.light.text.primary,
  },
  modalSubtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  modalScroll: {
    padding: Spacing.lg,
  },
  ratingSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    marginBottom: Spacing.md,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButton: {
    padding: Spacing.xs,
  },
  ratingCategory: {
    backgroundColor: Colors.light.background.secondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  ratingTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
    marginLeft: Spacing.sm,
  },
  ratingDescription: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    marginBottom: Spacing.sm,
  },
  commentSection: {
    marginBottom: Spacing.lg,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  commentInput: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.primary,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border.light,
    borderRadius: 12,
    backgroundColor: Colors.light.background.secondary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: FontSize.xs,
    fontFamily: 'OpenSans-Regular',
    color: Colors.light.text.secondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border.light,
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.background.secondary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.primary,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.light.text.inverse,
  },
}); 