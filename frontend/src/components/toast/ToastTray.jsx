import Toast, { useToasts } from "./ToastStorage.js";
import "./ToastTray.css";

export const ToastTray = () => {
  const toasts = useToasts();

  return (
    <div className="toast-tray">
      {toasts.map((toast) => (
        <div
          className={`toast-tray__toast --${toast.type}`}
          key={toast.key}
          onClick={() => Toast.pop(toast.key)}
          onMouseEnter={() => Toast.pause(toast.key)}
          onMouseLeave={() => Toast.resume(toast.key)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
