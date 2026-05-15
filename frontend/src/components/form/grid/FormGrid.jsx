import "./FormGrid.css";

export function FormGrid({ children, className }) {
  return <div className={`form-grid ${className ?? ""}`}>{children}</div>;
}
