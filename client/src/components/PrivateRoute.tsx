import { Navigate } from "react-router-dom";
import { PrivateRouteProps } from "../models/contextmodel/Context";

const PrivateRoute = (
  {
    children
  }: PrivateRouteProps
) => {
  const isAuthenticated = sessionStorage.getItem("auth-emp");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
