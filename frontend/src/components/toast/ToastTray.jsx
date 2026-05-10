import { useToasties } from "./ToastStorage";
import "./ToastTray.css";

export const ToastTray = () => {
  const toasties = useToasties();

  return (
    <div className="toast-tray">
      {toasties.map((toasty) => (
        <div className={`toast-tray__toast --${toasty.type}`} key={toasty.key}>
          {toasty.message}
        </div>
      ))}
    </div>
  );
};
