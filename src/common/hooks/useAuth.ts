import { useSelector } from "react-redux";
import { registrSelector } from "../../features/login/slice-login";

export const useAuth = () => {
  const { email, token, id } = useSelector(registrSelector);

  return {
    isAuth: Boolean(email && token && id),
    email,
    token,
    id,
  };
};
