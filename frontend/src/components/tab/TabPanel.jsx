import { useContext } from "react";
import { TabsContext } from "./context";

export default function TabPanel({ id, children, ...props }) {
  const { selected, tabsId } = useContext(TabsContext);

  return (
    <div
      {...props}
      id={`${tabsId}-panel-${id}`}
      role="tabpanel"
      aria-labelledby={`${tabsId}-tab-${id}`}
      tabIndex={0}
      hidden={selected !== id}
    >
      {children}
    </div>
  );
}
