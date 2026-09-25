import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../store/Auth.store";
import { Fragment } from "react";

/**
 *
 * @param {import("react").ComponentType} Component
 * @returns {import("react").ComponentType}
 */
export function WithAuthGuard(Component) {
  /** @type {import("react").FC} */
  return (props) => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth)
      return <Navigate to="/sign-in" state={{ from: location }} replace />;

    return <Component {...props} />;
  };
}

/** @type {import("react").ComponentType} */
export const AuthGuard = WithAuthGuard(Fragment);

export function RoleAuthGuard({ roleId, children, matchId }) {
  const auth = useAuth();

  if (
    !auth ||
    (roleId && auth.roleId !== roleId) ||
    (matchId && auth.id !== Number(matchId))
  )
    return <></>;

  return <>{children}</>;
}
