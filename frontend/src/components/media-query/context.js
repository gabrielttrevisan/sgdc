import { createContext } from "react";

/** @type {import("react").Context<MediaQueryContextState | null>} */
export const MediaQueryContext = createContext(null);

/**
 * @typedef {Object} MediaQueryMatchChangeEvent
 * @prop {boolean} matches
 * @prop {string} query
 * @prop {MediaQueryListEvent} nativeEvent
 */

/**
 * @callback OnMediaQueryMatchChangeHandler
 * @param {MediaQueryMatchChangeEvent} event
 * @returns {void}
 */

/**
 * @callback MediaQueryMatchCheckCallback
 * @param {string} query
 * @param {OnMediaQueryMatchChangeHandler} changeHandler
 * @returns {boolean}
 */

/**
 * @typedef {Object} MediaQueryContextState
 * @prop {Map<string, MediaQueryState>} breakpoints
 * @prop {MediaQueryMatchCheckCallback} matches
 */

/**
 * @typedef {Object} MediaQueryState
 * @prop {Set<OnMediaQueryMatchChangeHandler>} listeners
 * @prop {MediaQueryList} list
 */
