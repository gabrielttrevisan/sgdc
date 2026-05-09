import NavContextProvider from "./context/Provider";

/**
 * @typedef {Object} NavProps
 * @prop {import("react").ReactNode} children
 */

/** @type {import("react").FC<NavProps>} */
export const Nav = ({ children }) => {
  return (
    <NavContextProvider>
      <nav>{children}</nav>
    </NavContextProvider>
  );
};
