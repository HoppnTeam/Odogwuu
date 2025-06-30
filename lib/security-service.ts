import { supabase } from './supabase';
import { Alert } from 'react-native';

// Input validation patterns
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s\-']{2,50}$/,
  orderId: /^HP-\d{2}-\d{7}$/,
  price: /^\d+(\.\d{1,2})?$/,
  quantity: /^[1-9]\d*$/,
};

// Security configuration
const SECURITY_CONFIG = {
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordMinLength: 8,
  maxOrderAmount: 1000, // Maximum order amount in dollars
  maxItemsPerOrder: 20,
};

export class SecurityService {
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  /**
   * Validate email format
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!VALIDATION_PATTERNS.email.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email address is too long' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password || typeof password !== 'string') {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < SECURITY_CONFIG.passwordMinLength) {
      return { isValid: false, error: `Password must be at least ${SECURITY_CONFIG.passwordMinLength} characters` };
    }
    
    if (!VALIDATION_PATTERNS.password.test(password)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate name format
   */
  static validateName(name: string): { isValid: boolean; error?: string } {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'Name is required' };
    }
    
    if (!VALIDATION_PATTERNS.name.test(name)) {
      return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes (2-50 characters)' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate user input for XSS prevention
   */
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters and scripts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .trim();
  }

  /**
   * Validate order data
   */
  static validateOrderData(orderData: any): { isValid: boolean; error?: string } {
    if (!orderData) {
      return { isValid: false, error: 'Order data is required' };
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return { isValid: false, error: 'Order must contain at least one item' };
    }

    if (orderData.items.length > SECURITY_CONFIG.maxItemsPerOrder) {
      return { isValid: false, error: `Order cannot contain more than ${SECURITY_CONFIG.maxItemsPerOrder} items` };
    }

    // Validate total amount
    if (!orderData.total_amount || typeof orderData.total_amount !== 'number') {
      return { isValid: false, error: 'Invalid order total' };
    }

    if (orderData.total_amount <= 0) {
      return { isValid: false, error: 'Order total must be greater than zero' };
    }

    if (orderData.total_amount > SECURITY_CONFIG.maxOrderAmount) {
      return { isValid: false, error: `Order total cannot exceed $${SECURITY_CONFIG.maxOrderAmount}` };
    }

    // Validate restaurant ID
    if (!orderData.restaurant_id || typeof orderData.restaurant_id !== 'string') {
      return { isValid: false, error: 'Invalid restaurant selection' };
    }

    // Validate items
    for (const item of orderData.items) {
      if (!item.dish_id || !item.quantity || item.quantity <= 0) {
        return { isValid: false, error: 'Invalid item data' };
      }
      
      if (item.quantity > 50) {
        return { isValid: false, error: 'Item quantity cannot exceed 50' };
      }
    }

    return { isValid: true };
  }

  /**
   * Check if user is authenticated and session is valid
   */
  static async checkAuthentication(): Promise<{ isAuthenticated: boolean; user?: any; error?: string }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { isAuthenticated: false, error: 'Authentication check failed' };
      }
      
      if (!session) {
        return { isAuthenticated: false, error: 'No active session' };
      }
      
      // Check if session is expired
      const now = Date.now();
      const sessionExpiry = new Date(session.expires_at! * 1000).getTime();
      
      if (now > sessionExpiry) {
        await supabase.auth.signOut();
        return { isAuthenticated: false, error: 'Session expired' };
      }
      
      return { isAuthenticated: true, user: session.user };
    } catch (error) {
      console.error('Authentication check error:', error);
      return { isAuthenticated: false, error: 'Authentication check failed' };
    }
  }

  /**
   * Check if user can access specific data
   */
  static async checkDataAccess(userId: string, resourceType: string, resourceId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      // Users can only access their own data
      if (resourceType === 'user' || resourceType === 'order' || resourceType === 'review') {
        return user.id === userId;
      }
      
      // Public resources
      if (resourceType === 'restaurant' || resourceType === 'dish') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Data access check error:', error);
      return false;
    }
  }

  /**
   * Rate limiting for login attempts
   */
  static checkLoginAttempts(email: string): { canAttempt: boolean; remainingTime?: number } {
    const attempts = this.loginAttempts.get(email);
    
    if (!attempts) {
      return { canAttempt: true };
    }
    
    const now = Date.now();
    const timeSinceLastAttempt = now - attempts.lastAttempt;
    
    // Reset if lockout period has passed
    if (timeSinceLastAttempt > SECURITY_CONFIG.lockoutDuration) {
      this.loginAttempts.delete(email);
      return { canAttempt: true };
    }
    
    // Check if max attempts reached
    if (attempts.count >= SECURITY_CONFIG.maxLoginAttempts) {
      const remainingTime = SECURITY_CONFIG.lockoutDuration - timeSinceLastAttempt;
      return { canAttempt: false, remainingTime };
    }
    
    return { canAttempt: true };
  }

  /**
   * Record login attempt
   */
  static recordLoginAttempt(email: string, success: boolean): void {
    if (success) {
      this.loginAttempts.delete(email);
      return;
    }
    
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  /**
   * Validate and sanitize review data
   */
  static validateReviewData(reviewData: any): { isValid: boolean; error?: string; sanitizedData?: any } {
    if (!reviewData) {
      return { isValid: false, error: 'Review data is required' };
    }

    const sanitizedData = { ...reviewData };

    // Validate rating
    if (!reviewData.rating || typeof reviewData.rating !== 'number') {
      return { isValid: false, error: 'Rating is required' };
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { isValid: false, error: 'Rating must be between 1 and 5' };
    }

    // Sanitize comment
    if (reviewData.comment) {
      if (typeof reviewData.comment !== 'string') {
        return { isValid: false, error: 'Invalid comment format' };
      }
      
      if (reviewData.comment.length > 1000) {
        return { isValid: false, error: 'Comment cannot exceed 1000 characters' };
      }
      
      sanitizedData.comment = this.sanitizeInput(reviewData.comment);
    }

    // Validate order ID
    if (!reviewData.order_id || typeof reviewData.order_id !== 'string') {
      return { isValid: false, error: 'Order ID is required' };
    }

    return { isValid: true, sanitizedData };
  }

  /**
   * Log security events
   */
  static logSecurityEvent(event: string, details: any): void {
    console.log(`[SECURITY] ${event}:`, {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: 'Hoppn Mobile App'
    });
  }

  /**
   * Force logout user
   */
  static async forceLogout(reason: string): Promise<void> {
    try {
      this.logSecurityEvent('FORCE_LOGOUT', { reason });
      await supabase.auth.signOut();
      
      Alert.alert(
        'Session Expired',
        'Your session has expired for security reasons. Please log in again.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Force logout error:', error);
    }
  }

  /**
   * Validate HP order ID format
   */
  static validateOrderId(orderId: string): boolean {
    return VALIDATION_PATTERNS.orderId.test(orderId);
  }

  /**
   * Check if user has permission to perform action
   */
  static async checkPermission(userId: string, action: string, resourceId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id !== userId) {
        return false;
      }
      
      // Define permission rules
      const permissions = {
        'create_order': true,
        'view_own_orders': true,
        'update_own_orders': true,
        'create_review': true,
        'update_own_review': true,
        'view_own_profile': true,
        'update_own_profile': true,
        'access_vendor_data': false, // Customers cannot access vendor data
        'access_admin_data': false,  // Customers cannot access admin data
      };
      
      return permissions[action as keyof typeof permissions] || false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }
} 