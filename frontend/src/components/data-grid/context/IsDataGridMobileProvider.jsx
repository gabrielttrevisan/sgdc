import useMatchMedia from "../../media-query/useMatchMedia";
import { IsDataGridMobileContext } from "./IsDataGridMobileContext";

export const IsDataGridMobileProvider = ({ children }) => {
  const isMobile = useMatchMedia("(max-width: 1255px)");

  return (
    <IsDataGridMobileContext value={isMobile}>
      {children}
    </IsDataGridMobileContext>
  );
};
