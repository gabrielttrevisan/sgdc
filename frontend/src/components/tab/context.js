import { createContext } from "react";

export const TabsContext = createContext({
  selected: null,
  select(_id) {},
});
