import { createContext } from "react";

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

/** @type {import("react").Context<NavController>} */
const NavContext = createContext({ selected: null, open: () => undefined });

export default NavContext;
