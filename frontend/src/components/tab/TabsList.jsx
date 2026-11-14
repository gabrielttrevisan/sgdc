import { useContext, useEffect, useRef } from "react";
import { TabsContext } from "./context";

export default function TabsList({
  children,
  orientation = "horizontal",
  ...props
}) {
  const { select, selectIfUnset } = useContext(TabsContext);
  const tabListRef = useRef(null);

  useEffect(() => {
    const firstTab = tabListRef.current?.querySelector(
      '[role="tab"]:not(:disabled)',
    );

    if (firstTab) {
      selectIfUnset(firstTab.dataset.tabId);
    }
  }, [selectIfUnset]);

  function handleKeyDown(event) {
    const tabs = Array.from(
      tabListRef.current.querySelectorAll('[role="tab"]:not(:disabled)'),
    );
    const currentTab = event.target.closest('[role="tab"]');
    const currentIndex = tabs.indexOf(currentTab);

    if (currentIndex === -1) return;

    let nextIndex;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else if (
      orientation === "horizontal" &&
      (event.key === "ArrowRight" || event.key === "ArrowLeft")
    ) {
      const direction = event.key === "ArrowRight" ? 1 : -1;
      nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    } else if (
      orientation === "vertical" &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      const direction = event.key === "ArrowDown" ? 1 : -1;
      nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    select(nextTab.dataset.tabId);
  }

  return (
    <div
      {...props}
      ref={tabListRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
