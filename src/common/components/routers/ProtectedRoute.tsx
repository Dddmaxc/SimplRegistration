import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  isAuth,
  children,
}: {
  isAuth: boolean;
  children: React.ReactNode;
}) => {
  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
};
