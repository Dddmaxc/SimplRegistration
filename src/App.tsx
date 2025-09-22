import { Route, Routes } from "react-router-dom";
import { Header } from "./common/components/header/Header";
import { selectorCartWatcher } from "./features/cart/slice-modals";
import { Cart } from "./features/cart/ui/Cart";
import { CartWatcher } from "./features/cartWatcher/CartWatcher";
import { Main } from "./common/components/main/Main";
import { Shop } from "./common/components/main/Shop/Shop";
import { useAppSelector } from "./common/hooks/selector";
import {
  otherAuthOpen,
  sModalsForRegistr,
} from "./common/components/auth/forma/slice-loginModal";
import { RegistrationWatcher } from "./features/registrationWatcher/registrationWatcher";
import { Registration } from "./common/components/auth/telephon/Registration";
import { LoginWatcher } from "./common/components/auth/forma/loginWatcher";
import { LoginIn } from "./common/components/auth/forma/LoginIn";
import "./App.css";
import { Footer } from "./common/components/footer/Footer";
import LinearProgress from "@mui/material/LinearProgress";
import { selectStatus } from "./app/app-slice";

export const App = () => {
  const isOpen = useAppSelector(selectorCartWatcher);
  const isOpenR = useAppSelector(sModalsForRegistr);
  const openOther = useAppSelector(otherAuthOpen);
   const status = useAppSelector(selectStatus);

  return (
    <div className="App">
      {/* Передаем action открытия корзины */}
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
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>
      <Footer />
    </div>
  );
};
