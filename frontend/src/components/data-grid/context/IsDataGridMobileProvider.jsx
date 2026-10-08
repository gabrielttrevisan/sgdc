import useMatchMedia from "../../media-query/useMatchMedia";
import { IsDataGridMobileContext } from "./IsDataGridMobileContext";

/**
 * @typedef {Object} IsDataGridMobileProviderProps
 * @prop {import("react").ReactNode} children
 * @prop {string} [breakpoint]
 * @prop {string} [matchMedia]
 */

const DEFAULT_BREAKPOINT = "1255px";

/**
 * @param {IsDataGridMobileProviderProps} props
 * @returns {import("react").JSX.Element}
 */
export const IsDataGridMobileProvider = ({
  children,
  breakpoint = DEFAULT_BREAKPOINT,
  matchMedia,
}) => {
  const isMobile = useMatchMedia(
    breakpoint
      ? `(max-width: ${breakpoint})`
      : (matchMedia ?? `(max-width: ${DEFAULT_BREAKPOINT})`),
  );

  return (
    <IsDataGridMobileContext value={isMobile}>
      {children}
    </IsDataGridMobileContext>
  );
};
