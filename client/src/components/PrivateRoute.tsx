import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth-emp");

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
