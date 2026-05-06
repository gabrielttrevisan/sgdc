/**
 * @typedef {Object} NavProps
 * @prop {import("react").ReactNode} children
 */

import NavContextProvider from "./NavContext"


/** @type {import("react").FC<NavProps>} */
export const Nav = ({ children }) => {
    return <NavContextProvider><nav>{children}</nav></NavContextProvider>
}