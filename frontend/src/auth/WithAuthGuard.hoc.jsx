import { Navigate, useLocation } from "react-router";
import { useAuth } from "./Auth.store";
import { Fragment } from "react";

export function WithAuthGuard(Component) {
  return (props) => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth)
      return <Navigate to="/sign-in" state={{ from: location }} replace />;

    return <Component {...props} />;
  };
}

export const AuthGuard = WithAuthGuard(Fragment);
