import { useCallback, useState } from "react";
import NavContext from "./NavContext";

/**
 * @typedef {Object} NavContextProviderProps
 * @prop {import("react").ReactNode}
 */

/** @type {import("react").FC<NavContextProviderProps>} */
const NavContextProvider = ({ children }) => {
  const [open, setOpen] = useState(null);

  return (
    <NavContext
      value={{
        selected: open,
        open: useCallback((id) => {
          setOpen(id);
        }, []),
      }}
    >
      {children}
    </NavContext>
  );
};

export default NavContextProvider;
