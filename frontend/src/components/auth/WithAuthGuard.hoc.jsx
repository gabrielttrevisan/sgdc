import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../store/Auth.store";
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

export function RoleAuthGuard({ roleId, children }) {
  const auth = useAuth();

  if (!auth || auth.roleId !== roleId)
    return <></>;

  return <>{children}</>;
}
