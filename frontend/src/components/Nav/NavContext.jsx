import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * @callback NavStateChangeCallback
 * @param {string} id
 */

/**
 * @typedef {VoidFunction} NavStateToggleCallback
 */

/**
 * @typedef {Object} NavController
 * @prop {NavStateChangeCallback} open
 * @prop {string|null} selected
 */

const NavContext = createContext({ selected: null, open: () => undefined });

/**
 * @typedef {Object} NavContextProviderProps
 * @prop {import("react").ReactNode}
 */

/** @type {import("react").FC<NavContextProviderProps>} */
const NavContextProvider = ({ children }) => {
    const [open, setOpen] = useState(null)

    return (
        <NavContext value={{
            selected: open,
            open: useCallback((id) => {
                setOpen(id)
            }, [])
        }}>
            {children}
        </NavContext>
    )
}

export default NavContextProvider

export function useNavContext() {
    return useContext(NavContext)
}