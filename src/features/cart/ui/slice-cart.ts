import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Тип CartItem обновлен, чтобы соответствовать типу Product
// из products-Slice, используя 'name' и 'imageUrl'.
export type CartItem = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Тип экшена теперь ожидает объект с 'name' и 'imageUrl'.
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    // Полное удаление
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Уменьшение количества на 1
    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
  selectors: {
    selectQuantity: (state) => state.items.length,
  },
});

export const { addToCart, removeFromCart, decreaseQuantity } =
  cartSlice.actions;
export const { selectQuantity } = cartSlice.selectors;
export default cartSlice.reducer;
