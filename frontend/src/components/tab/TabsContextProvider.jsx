import { useCallback, useId, useState } from "react";
import { TabsContext } from "./context";

export default function TabsContextProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const tabsId = useId();

  const select = useCallback((id) => {
    setSelected(id);
  }, []);

  const selectIfUnset = useCallback((id) => {
    setSelected((current) => current ?? id);
  }, []);

  return (
    <TabsContext
      value={{
        selected,
        select,
        selectIfUnset,
        tabsId,
      }}
    >
      {children}
    </TabsContext>
  );
}
