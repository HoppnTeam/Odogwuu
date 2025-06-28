import { supabase } from './supabase';
import { CartItem } from '@/types';

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

export const orderService = {
  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<Order | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: orderData.restaurant_id,
          items: orderData.items,
          total_amount: orderData.total_amount,
          tax_amount: orderData.tax_amount,
          service_fee: orderData.service_fee,
          pickup_location: orderData.pickup_location,
          payment_method: orderData.payment_method,
          special_instructions: orderData.special_instructions,
          status: 'pending',
          payment_status: 'pending'
        })
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open
          )
        `)
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('OrderService.createOrder error:', error);
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(): Promise<OrderWithRestaurant[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        throw new Error('Failed to fetch orders');
      }

      return data || [];
    } catch (error) {
      console.error('OrderService.getUserOrders error:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<OrderWithRestaurant | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('OrderService.getOrderById error:', error);
      return null;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('OrderService.updateOrderStatus error:', error);
      return false;
    }
  },

  // Subscribe to real-time order updates
  subscribeToOrderUpdates(orderId: string, callback: (order: OrderWithRestaurant) => void) {
    const subscription = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order update received:', payload);
          // Fetch the updated order with restaurant details
          this.getOrderById(orderId).then(order => {
            if (order) {
              callback(order);
            }
          });
        }
      )
      .subscribe();

    return subscription;
  },

  // Subscribe to user's order updates
  async subscribeToUserOrders(callback: (orders: OrderWithRestaurant[]) => void) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user for order subscription');
      return null;
    }

    const subscription = supabase
      .channel(`user-orders-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('User order update received:', payload);
          // Fetch updated user orders
          this.getUserOrders().then(orders => {
            callback(orders);
          });
        }
      )
      .subscribe();

    return subscription;
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error cancelling order:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('OrderService.cancelOrder error:', error);
      return false;
    }
  },

  // Mark order as picked up
  async markOrderPickedUp(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'picked_up',
          actual_pickup_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error marking order as picked up:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('OrderService.markOrderPickedUp error:', error);
      return false;
    }
  }
}; 