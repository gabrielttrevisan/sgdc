import Toast, { useToasts } from "./ToastStorage";
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
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
