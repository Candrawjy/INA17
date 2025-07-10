import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store";
import { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const location = useLocation();

  const authOnlyPaths = ["/", "/login", "/register"];

  if (token && authOnlyPaths.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
