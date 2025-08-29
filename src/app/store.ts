// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../features/cart/ui/slice-cart";
import cartWatcherReducer from "../features/cart/slice-modals";
import modalsForRegistrModalReducer from "../features/login/slice-loginModal";
import loginReducer from "../features/login/slice-login";

export const store = configureStore({
  reducer: {
    modals: cartWatcherReducer,
    cart: cartSlice,
    modalsForRegistr: modalsForRegistrModalReducer,
    login: loginReducer,
  },
});
// Типы для использования с useSelector / useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
