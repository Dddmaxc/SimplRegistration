import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { closeC } from "../cart/slice-modals";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";

export const CartWatcher = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(closeC());
  }, [location.pathname]);

  return null;
};
