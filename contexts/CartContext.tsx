import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Dish, DishSize } from '@/types';
import { cartService } from '@/lib/supabase-service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { dish: Dish; quantity: number; special_instructions?: string; spice_level?: number; allergen_triggers?: string[]; extras?: string[]; preparation_notes?: string; selected_size?: DishSize } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { dishId: string; quantity: number } }
  | { type: 'UPDATE_CUSTOMIZATION'; payload: { dishId: string; customizations: Partial<CartItem> } }
  | { type: 'ADD_EXTRA'; payload: { dishId: string; extra: string } }
  | { type: 'REMOVE_EXTRA'; payload: { dishId: string; extraIndex: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (dish: Dish, quantity: number, customizations?: Partial<CartItem>) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateCustomization: (dishId: string, customizations: Partial<CartItem>) => void;
  addExtra: (dishId: string, extra: string) => void;
  removeExtra: (dishId: string, extraIndex: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItemTotal: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateItemTotal = (item: CartItem): number => {
  const itemPrice = item.selected_size ? item.selected_size.price : item.base_price;
  const dishTotal = itemPrice * item.quantity;
  return dishTotal;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.dish_id === action.payload.dish.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { 
                ...item, 
                quantity: item.quantity + action.payload.quantity,
                // Merge customizations if provided
                ...(action.payload.spice_level && { spice_level: action.payload.spice_level }),
                ...(action.payload.allergen_triggers && { allergen_triggers: action.payload.allergen_triggers }),
                ...(action.payload.extras && { extras: [...(item.extras || []), ...action.payload.extras] }),
                ...(action.payload.preparation_notes && { preparation_notes: action.payload.preparation_notes }),
              }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            id: `${action.payload.dish.id}-${Date.now()}`,
            dish_id: action.payload.dish.id,
            dish_name: action.payload.dish.name,
            restaurant_id: action.payload.dish.restaurant_id,
            restaurant_name: 'Mama Africa Kitchen', // This should come from the dish data
            image_url: action.payload.dish.image_url,
            base_price: Number(action.payload.dish.base_price) || 0,
            quantity: action.payload.quantity,
            special_instructions: action.payload.special_instructions,
            spice_level: action.payload.spice_level,
            allergen_triggers: action.payload.allergen_triggers,
            extras: action.payload.extras,
            preparation_notes: action.payload.preparation_notes,
            selected_size: action.payload.selected_size,
            total_price: action.payload.selected_size 
              ? action.payload.selected_size.price * action.payload.quantity
              : Number(action.payload.dish.base_price) * action.payload.quantity,
          },
        ];
      }

      const total = newItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
      return { items: newItems, total };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.dish_id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
      return { items: newItems, total };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.dish_id === action.payload.dishId
          ? { 
              ...item, 
              quantity: action.payload.quantity, 
              total_price: item.selected_size 
                ? item.selected_size.price * action.payload.quantity
                : item.base_price * action.payload.quantity
            }
          : item
      ).filter(item => item.quantity > 0);

      const total = newItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
      return { items: newItems, total };
    }

    case 'UPDATE_CUSTOMIZATION': {
      const newItems = state.items.map(item =>
        item.dish_id === action.payload.dishId
          ? { ...item, ...action.payload.customizations }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
      return { items: newItems, total };
    }

    case 'ADD_EXTRA': {
      const newItems = state.items.map(item =>
        item.dish_id === action.payload.dishId
          ? { 
              ...item, 
              extras: [...(item.extras || []), action.payload.extra]
            }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
      return { items: newItems, total };
    }

    case 'REMOVE_EXTRA': {
      const newItems = state.items.map(item =>
        item.dish_id === action.payload.dishId
          ? { 
              ...item, 
              extras: item.extras?.filter((_, index) => index !== action.payload.extraIndex) || []
            }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
      return { items: newItems, total };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const { user } = useAuth();

  // Load cart from Supabase on mount or login
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const items = await cartService.getCartItems();
        // Map DB items to CartItem shape if needed
        dispatch({ type: 'CLEAR_CART' });
        items.forEach((item: any) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: {
              dish: {
                id: item.dish_id,
                restaurant_id: item.restaurant_id || '',
                name: item.dish_name || '',
                description: '',
                image_url: item.image_url || '',
                base_price: item.base_price || 0,
                category: '',
                base_spice_level: item.spice_level || 3,
                country_origin: '',
                country_flag: '',
                origin_story: '',
                base_ingredients: [],
                is_vegetarian: false,
                is_vegan: false,
                is_active: true,
                created_at: '',
                updated_at: '',
              },
              quantity: item.quantity,
              special_instructions: item.special_instructions,
              spice_level: item.spice_level,
              extras: item.extras,
            },
          });
        });
      }
    };
    fetchCart();
  }, [user]);

  // Add item to cart and Supabase (no duplicates)
  const addItem = async (dish: Dish, quantity: number, customizations?: Partial<CartItem>) => {
    await cartService.addCartItem({
      dish_id: dish.id,
      quantity,
      special_instructions: customizations?.special_instructions,
      spice_level: customizations?.spice_level,
      extras: customizations?.extras,
    });
    dispatch({ type: 'ADD_ITEM', payload: { dish, quantity, ...customizations } });
  };

  // Update quantity in cart and Supabase
  const updateQuantity = async (dishId: string, quantity: number) => {
    await cartService.updateCartItem({ dish_id: dishId, quantity });
    dispatch({ type: 'UPDATE_QUANTITY', payload: { dishId, quantity } });
  };

  // Remove item from cart and Supabase
  const removeItem = async (dishId: string) => {
    await cartService.removeCartItem(dishId);
    dispatch({ type: 'REMOVE_ITEM', payload: dishId });
  };

  // Update customizations in cart and Supabase
  const updateCustomization = async (dishId: string, customizations: Partial<CartItem>) => {
    await cartService.updateCartItem({ dish_id: dishId, ...customizations });
    dispatch({ type: 'UPDATE_CUSTOMIZATION', payload: { dishId, customizations } });
  };

  // Add extra in cart and Supabase
  const addExtra = async (dishId: string, extra: string) => {
    // Fetch current item, add extra, then update
    const item = state.items.find(i => i.dish_id === dishId);
    const newExtras = [...(item?.extras || []), extra];
    await cartService.updateCartItem({ dish_id: dishId, extras: newExtras });
    dispatch({ type: 'ADD_EXTRA', payload: { dishId, extra } });
  };

  // Remove extra in cart and Supabase
  const removeExtra = async (dishId: string, extraIndex: number) => {
    const item = state.items.find(i => i.dish_id === dishId);
    const newExtras = (item?.extras || []).filter((_, idx) => idx !== extraIndex);
    await cartService.updateCartItem({ dish_id: dishId, extras: newExtras });
    dispatch({ type: 'REMOVE_EXTRA', payload: { dishId, extraIndex } });
  };

  // Clear cart in Supabase and local state
  const clearCart = async () => {
    await cartService.clearCart();
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemTotal = (item: CartItem) => {
    return calculateItemTotal(item);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    updateCustomization,
    addExtra,
    removeExtra,
    clearCart,
    getItemCount,
    getItemTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};