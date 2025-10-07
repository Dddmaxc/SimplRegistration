// App.tsx

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { auth } from "./firebase";

// Импорты компонентов
import { Header } from "./common/components/header/Header";
import { Footer } from "./common/components/footer/Footer";
import { Main } from "./common/components/main/Main";
import { Shop } from "./common/components/main/Shop/Shop";
import { Cart } from "./features/cart/ui/Cart";
import { CartWatcher } from "./features/cartWatcher/CartWatcher";
import { RegistrationWatcher } from "./features/registrationWatcher/registrationWatcher";
import { LoginWatcher } from "./common/components/auth/forma/loginWatcher";
import { Registration } from "./common/components/auth/telephon/Registration";
import { LoginIn } from "./common/components/auth/forma/LoginIn";

import { useAppSelector } from "./common/hooks/selector";
import { selectorCartWatcher } from "./features/cart/slice-modals";
import {
  sModalsForRegistr,
  otherAuthOpen,
} from "./common/components/auth/forma/slice-loginModal";
import LinearProgress from "@mui/material/LinearProgress";
import { selectStatus } from "./app/app-slice";
import {
  clearUser,
  selectUserId,
  setUser,
} from "./common/components/auth/forma/authSlice";
import type { AppDispatch } from "./app/store";
import { ProtectedRoute } from "./common/components/routers/ProtectedRoute";
import { PageNotFound } from "./common/components/pageNotFound/PageNotFound";

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useAppSelector(selectorCartWatcher);
  const isOpenR = useAppSelector(sModalsForRegistr);
  const openOther = useAppSelector(otherAuthOpen);
  const status = useAppSelector(selectStatus);
  const userId = useAppSelector(selectUserId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            token: firebaseUser.refreshToken,
            phoneNumber: firebaseUser.phoneNumber,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      {status === "loading" && <LinearProgress color="success" />}
      <RegistrationWatcher />
      {isOpenR && <Registration />}
      <CartWatcher />
      {isOpen && <Cart />}
      <LoginWatcher />
      {openOther && <LoginIn />}

      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/shop"
          element={
            <ProtectedRoute isAuth={!!userId}>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};
