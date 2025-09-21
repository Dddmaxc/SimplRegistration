// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/ui/slice-cart";
import cartWatcherReducer from "../features/cart/slice-modals";
import modalsForRegistrModalReducer from "../common/components/auth/forma/slice-loginModal";
import loginReducer from "../common/components/auth/forma/slice-login";
import productsReducer from "../features/cart/ui/products/products-slice";
import appReducer from "./app-slice";

export const store = configureStore({
  reducer: {
    modals: cartWatcherReducer,
    cart: cartReducer,
    modalsForRegistr: modalsForRegistrModalReducer,
    login: loginReducer,
    products: productsReducer,
    app: appReducer
  },
});
// Типы для использования с useSelector / useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



