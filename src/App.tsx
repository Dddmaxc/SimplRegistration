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
} from "./features/login/slice-loginModal";
import { RegistrationWatcher } from "./features/registrationWatcher/registrationWatcher";
import { Registration } from "./features/login/registration/Registration";
import { LoginWatcher } from "./features/login/loginWatcher";
import { LoginIn } from "./features/login/LoginIn";

export const App = () => {
  const isOpen = useAppSelector(selectorCartWatcher);
  const isOpenR = useAppSelector(sModalsForRegistr);
  const openOther = useAppSelector(otherAuthOpen);

  return (
    <div className="App">
      {/* Передаем action открытия корзины */}
      <Header />
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
    </div>
  );
};
