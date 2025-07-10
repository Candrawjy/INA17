import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useSelector((state: RootState) => state.user.token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
