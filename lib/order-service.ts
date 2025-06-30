import { supabase } from './supabase';
import { CartItem } from '@/types';
import { SecurityService } from './security-service';

export interface CreateOrderData {
  restaurant_id: string;
  items: CartItem[];
  total_amount: number;
  tax_amount: number;
  service_fee: number;
  pickup_location: string;
  payment_method: string;
  special_instructions?: string;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  items: CartItem[];
  total_amount: number;
  tax_amount: number;
  service_fee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
  pickup_location: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  estimated_pickup_time?: string;
  actual_pickup_time?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderWithRestaurant extends Order {
  restaurants: {
    id: string;
    name: string;
    address: string;
    pickup_time: string;
    is_open: boolean;
  };
}

export interface OrderItem {
  dish_id: string;
  quantity: number;
  customizations?: string[];
  special_instructions?: string;
}

export interface OrderData {
  restaurant_id: string;
  items: OrderItem[];
  total_amount: number;
  pickup_time?: string;
  special_instructions?: string;
}

class OrderService {
  /**
   * Create a new order with security validation
   */
  async createOrder(orderData: OrderData): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Validate order data
      const validation = SecurityService.validateOrderData(orderData);
      if (!validation.isValid) {
        SecurityService.logSecurityEvent('ORDER_VALIDATION_FAILED', { userId: user.id, error: validation.error });
        return { success: false, error: validation.error };
      }

      // Check user permissions
      const hasPermission = await SecurityService.checkPermission(user.id, 'create_order');
      if (!hasPermission) {
        SecurityService.logSecurityEvent('UNAUTHORIZED_ORDER_CREATION', { userId: user.id });
        return { success: false, error: 'Unauthorized to create orders' };
      }

      // Sanitize special instructions
      const sanitizedInstructions = orderData.special_instructions 
        ? SecurityService.sanitizeInput(orderData.special_instructions)
        : undefined;

      // Generate HP Order ID
      let hpOrderId: string | undefined;
      try {
        const { data: hpOrderData, error: hpOrderError } = await supabase.functions.invoke('generate-order-id');
        if (hpOrderError) {
          console.error('HP Order ID generation failed:', hpOrderError);
          SecurityService.logSecurityEvent('HP_ORDER_ID_GENERATION_FAILED', { userId: user.id, error: hpOrderError.message });
        } else {
          hpOrderId = hpOrderData?.hp_order_id;
        }
      } catch (error) {
        console.error('HP Order ID generation error:', error);
        SecurityService.logSecurityEvent('HP_ORDER_ID_GENERATION_ERROR', { userId: user.id, error: error });
      }

      // Create order
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: orderData.restaurant_id,
          items: orderData.items,
          total_amount: orderData.total_amount,
          status: 'pending',
          payment_status: 'pending',
          pickup_time: orderData.pickup_time,
          special_instructions: sanitizedInstructions,
          hp_order_id: hpOrderId
        })
        .select()
        .single();

      if (error) {
        SecurityService.logSecurityEvent('ORDER_CREATION_FAILED', { userId: user.id, error: error.message });
        return { success: false, error: error.message };
      }

      SecurityService.logSecurityEvent('ORDER_CREATED', { userId: user.id, orderId: order.id, hpOrderId });
      return { success: true, order };
    } catch (error: any) {
      console.error('Create order error:', error);
      SecurityService.logSecurityEvent('ORDER_CREATION_ERROR', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's orders with access control
   */
  async getUserOrders(): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check user permissions
      const hasPermission = await SecurityService.checkPermission(user.id, 'view_own_orders');
      if (!hasPermission) {
        SecurityService.logSecurityEvent('UNAUTHORIZED_ORDERS_ACCESS', { userId: user.id });
        return { success: false, error: 'Unauthorized to view orders' };
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        SecurityService.logSecurityEvent('ORDERS_FETCH_FAILED', { userId: user.id, error: error.message });
        return { success: false, error: error.message };
      }

      return { success: true, orders };
    } catch (error: any) {
      console.error('Get user orders error:', error);
      SecurityService.logSecurityEvent('ORDERS_FETCH_ERROR', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get specific order with access control
   */
  async getOrder(orderId: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check data access
      const hasAccess = await SecurityService.checkDataAccess(user.id, 'order', orderId);
      if (!hasAccess) {
        SecurityService.logSecurityEvent('UNAUTHORIZED_ORDER_ACCESS', { userId: user.id, orderId });
        return { success: false, error: 'Unauthorized to access this order' };
      }

      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, image_url, address)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        SecurityService.logSecurityEvent('ORDER_FETCH_FAILED', { userId: user.id, orderId, error: error.message });
        return { success: false, error: error.message };
      }

      return { success: true, order };
    } catch (error: any) {
      console.error('Get order error:', error);
      SecurityService.logSecurityEvent('ORDER_FETCH_ERROR', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Update order status with access control
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check data access
      const hasAccess = await SecurityService.checkDataAccess(user.id, 'order', orderId);
      if (!hasAccess) {
        SecurityService.logSecurityEvent('UNAUTHORIZED_ORDER_UPDATE', { userId: user.id, orderId });
        return { success: false, error: 'Unauthorized to update this order' };
      }

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return { success: false, error: 'Invalid order status' };
      }

      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) {
        SecurityService.logSecurityEvent('ORDER_STATUS_UPDATE_FAILED', { userId: user.id, orderId, status, error: error.message });
        return { success: false, error: error.message };
      }

      SecurityService.logSecurityEvent('ORDER_STATUS_UPDATED', { userId: user.id, orderId, status });
      return { success: true };
    } catch (error: any) {
      console.error('Update order status error:', error);
      SecurityService.logSecurityEvent('ORDER_STATUS_UPDATE_ERROR', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel order with access control
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Check data access
      const hasAccess = await SecurityService.checkDataAccess(user.id, 'order', orderId);
      if (!hasAccess) {
        SecurityService.logSecurityEvent('UNAUTHORIZED_ORDER_CANCELLATION', { userId: user.id, orderId });
        return { success: false, error: 'Unauthorized to cancel this order' };
      }

      // Check if order can be cancelled
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.status !== 'pending' && order.status !== 'confirmed') {
        return { success: false, error: 'Order cannot be cancelled at this stage' };
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id);

      if (error) {
        SecurityService.logSecurityEvent('ORDER_CANCELLATION_FAILED', { userId: user.id, orderId, error: error.message });
        return { success: false, error: error.message };
      }

      SecurityService.logSecurityEvent('ORDER_CANCELLED', { userId: user.id, orderId });
      return { success: true };
    } catch (error: any) {
      console.error('Cancel order error:', error);
      SecurityService.logSecurityEvent('ORDER_CANCELLATION_ERROR', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Track order by HP Order ID
   */
  async trackOrderByHpId(hpOrderId: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      // Validate HP Order ID format
      if (!SecurityService.validateOrderId(hpOrderId)) {
        return { success: false, error: 'Invalid HP Order ID format' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurant:restaurants(name, image_url, address)
        `)
        .eq('hp_order_id', hpOrderId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        SecurityService.logSecurityEvent('ORDER_TRACKING_FAILED', { userId: user.id, hpOrderId, error: error.message });
        return { success: false, error: error.message };
      }

      return { success: true, order };
    } catch (error: any) {
      console.error('Track order error:', error);
      SecurityService.logSecurityEvent('ORDER_TRACKING_ERROR', { error: error.message });
      return { success: false, error: error.message };
    }
  }
}

export const orderService = new OrderService(); 