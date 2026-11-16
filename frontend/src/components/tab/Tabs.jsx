import TabsContextProvider from "./TabsContextProvider";
import "./Tabs.css";

export default function Tabs({ children, ...props }) {
  return (
    <TabsContextProvider>
      <div {...props} className="tabs">
        {children}
      </div>
    </TabsContextProvider>
  );
}
