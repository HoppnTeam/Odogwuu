import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Dish } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { dish: Dish; quantity: number; special_instructions?: string; spice_level?: number; allergen_triggers?: string[]; extras?: string[]; preparation_notes?: string } }
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
  const dishTotal = item.base_price * item.quantity;
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
            total_price: Number(action.payload.dish.base_price) * action.payload.quantity,
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
          ? { ...item, quantity: action.payload.quantity, total_price: item.base_price * action.payload.quantity }
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

  const addItem = (dish: Dish, quantity: number, customizations?: Partial<CartItem>) => {
    dispatch({ type: 'ADD_ITEM', payload: { dish, quantity, ...customizations } });
  };

  const removeItem = (dishId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: dishId });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { dishId, quantity } });
  };

  const updateCustomization = (dishId: string, customizations: Partial<CartItem>) => {
    dispatch({ type: 'UPDATE_CUSTOMIZATION', payload: { dishId, customizations } });
  };

  const addExtra = (dishId: string, extra: string) => {
    dispatch({ type: 'ADD_EXTRA', payload: { dishId, extra } });
  };

  const removeExtra = (dishId: string, extraIndex: number) => {
    dispatch({ type: 'REMOVE_EXTRA', payload: { dishId, extraIndex } });
  };

  const clearCart = () => {
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