import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { closeOther, otherAuthOpen } from "./slice-loginModal";
import { LoginIn } from "./LoginIn";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

export const LoginWatcher = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const open = useSelector(otherAuthOpen);

  useEffect(() => {
    dispatch(closeOther());
  }, [location.pathname, dispatch]);

  if (open) {
    return React.createElement(LoginIn);
  }

  return null;
};
