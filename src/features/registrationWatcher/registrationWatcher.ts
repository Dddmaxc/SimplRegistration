import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../common/hooks/useAppDispatch";
import { closeR } from "../../common/components/auth/forma/slice-loginModal";

export const RegistrationWatcher = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(closeR());
  }, [location.pathname]);

  return null;
};
