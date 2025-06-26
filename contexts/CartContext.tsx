import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Dish } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { dish: Dish; quantity: number; special_instructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { dishId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (dish: Dish, quantity: number, special_instructions?: string) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.dish.id === action.payload.dish.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            dish: action.payload.dish,
            quantity: action.payload.quantity,
            special_instructions: action.payload.special_instructions,
          },
        ];
      }

      const total = newItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
      return { items: newItems, total };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.dish.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
      return { items: newItems, total };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.dish.id === action.payload.dishId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      const total = newItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
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

  const addItem = (dish: Dish, quantity: number, special_instructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { dish, quantity, special_instructions } });
  };

  const removeItem = (dishId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: dishId });
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { dishId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, getItemCount }}>
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