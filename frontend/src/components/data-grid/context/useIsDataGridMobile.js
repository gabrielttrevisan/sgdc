import { useContext } from "react";
import { IsDataGridMobileContext } from "./IsDataGridMobileContext";

export default function useIsDataGridMobile() {
  return useContext(IsDataGridMobileContext);
}
