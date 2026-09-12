import { createContext, useState } from "react";
import { auth } from "./Auth.store";

const MenuContext = createContext([]);

export function MenuProvider({ children }) {
  const [menu] = useState(() => auth.menu);

  return <MenuContext value={menu}>{children}</MenuContext>;
}
