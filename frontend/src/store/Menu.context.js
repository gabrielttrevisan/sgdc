import { createContext, useState } from "react";
import { authStore } from "./Auth.store";

const MenuContext = createContext([]);

export function MenuProvider({ children }) {
  const [menu] = useState(() => authStore.menu);

  return <MenuContext value={menu}>{children}</MenuContext>;
}
