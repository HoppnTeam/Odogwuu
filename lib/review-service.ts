import { supabase } from './supabase';
import { Review, ReviewWithDetails, ReviewFormData } from '@/types';

export class ReviewService {
  /**
   * Create a new review for a dish
   */
  static async createDishReview(
    userId: string,
    dishId: string,
    orderId: string,
    reviewData: ReviewFormData
  ): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          dish_id: dishId,
          order_id: orderId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          spice_level_rating: reviewData.spice_level_rating,
          authenticity_rating: reviewData.authenticity_rating,
          cultural_experience_rating: reviewData.cultural_experience_rating,
          overall_experience: reviewData.overall_experience,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating dish review:', error);
        throw new Error('Failed to create review');
      }

      return data;
    } catch (error) {
      console.error('ReviewService.createDishReview error:', error);
      throw error;
    }
  }

  /**
   * Create a new review for a vendor/restaurant
   */
  static async createVendorReview(
    userId: string,
    vendorId: string,
    orderId: string,
    reviewData: ReviewFormData
  ): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          vendor_id: vendorId,
          order_id: orderId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          spice_level_rating: reviewData.spice_level_rating,
          authenticity_rating: reviewData.authenticity_rating,
          cultural_experience_rating: reviewData.cultural_experience_rating,
          overall_experience: reviewData.overall_experience,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating vendor review:', error);
        throw new Error('Failed to create review');
      }

      return data;
    } catch (error) {
      console.error('ReviewService.createVendorReview error:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a specific dish
   */
  static async getDishReviews(dishId: string): Promise<ReviewWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user: users (
            full_name,
            avatar_url
          ),
          dish: dishes (
            name,
            country_origin,
            country_flag
          )
        `)
        .eq('dish_id', dishId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dish reviews:', error);
        throw new Error('Failed to fetch reviews');
      }

      return data || [];
    } catch (error) {
      console.error('ReviewService.getDishReviews error:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a specific vendor
   */
  static async getVendorReviews(vendorId: string): Promise<ReviewWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user: users (
            full_name,
            avatar_url
          ),
          vendor: vendors (
            name
          )
        `)
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vendor reviews:', error);
        throw new Error('Failed to fetch reviews');
      }

      return data || [];
    } catch (error) {
      console.error('ReviewService.getVendorReviews error:', error);
      throw error;
    }
  }

  /**
   * Get user's reviews
   */
  static async getUserReviews(userId: string): Promise<ReviewWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          dish: dishes (
            name,
            country_origin,
            country_flag
          ),
          vendor: vendors (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user reviews:', error);
        throw new Error('Failed to fetch reviews');
      }

      return data || [];
    } catch (error) {
      console.error('ReviewService.getUserReviews error:', error);
      throw error;
    }
  }

  /**
   * Check if user has already reviewed a dish
   */
  static async hasUserReviewedDish(userId: string, dishId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('dish_id', dishId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking dish review:', error);
        throw new Error('Failed to check review status');
      }

      return !!data;
    } catch (error) {
      console.error('ReviewService.hasUserReviewedDish error:', error);
      throw error;
    }
  }

  /**
   * Check if user has already reviewed a vendor
   */
  static async hasUserReviewedVendor(userId: string, vendorId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('vendor_id', vendorId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking vendor review:', error);
        throw new Error('Failed to check review status');
      }

      return !!data;
    } catch (error) {
      console.error('ReviewService.hasUserReviewedVendor error:', error);
      throw error;
    }
  }

  /**
   * Update an existing review
   */
  static async updateReview(
    reviewId: string,
    reviewData: Partial<ReviewFormData>
  ): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          ...reviewData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw new Error('Failed to update review');
      }

      return data;
    } catch (error) {
      console.error('ReviewService.updateReview error:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('ReviewService.deleteReview error:', error);
      throw error;
    }
  }

  /**
   * Get average rating for a dish
   */
  static async getDishAverageRating(dishId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('dish_id', dishId);

      if (error) {
        console.error('Error fetching dish ratings:', error);
        throw new Error('Failed to fetch ratings');
      }

      if (!data || data.length === 0) return 0;

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / data.length;
    } catch (error) {
      console.error('ReviewService.getDishAverageRating error:', error);
      throw error;
    }
  }

  /**
   * Get average rating for a vendor
   */
  static async getVendorAverageRating(vendorId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('vendor_id', vendorId);

      if (error) {
        console.error('Error fetching vendor ratings:', error);
        throw new Error('Failed to fetch ratings');
      }

      if (!data || data.length === 0) return 0;

      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / data.length;
    } catch (error) {
      console.error('ReviewService.getVendorAverageRating error:', error);
      throw error;
    }
  }
} 