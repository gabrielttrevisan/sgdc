import { useContext } from "react";
import { TabsContext } from "./context";

export default function TabButton({
  id,
  children,
  className = "",
  onClick,
  ...props
}) {
  const { selected, select, tabsId } = useContext(TabsContext);
  const tabId = `${tabsId}-tab-${id}`;
  const panelId = `${tabsId}-panel-${id}`;

  return (
    <button
      {...props}
      type="button"
      id={tabId}
      data-tab-id={id}
      role="tab"
      aria-selected={selected === id}
      aria-controls={panelId}
      tabIndex={selected === id ? 0 : -1}
      className={`pill pill--purple-label pill--small${className ? ` ${className}` : ""}`}
      onClick={(event) => {
        select(id);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
