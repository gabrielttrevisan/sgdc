import { useContext } from "react";
import NavContext from "./NavContext";

export function useNavContext() {
  return useContext(NavContext);
}
