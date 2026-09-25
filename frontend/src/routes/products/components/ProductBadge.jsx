export function ProductBadge({ children, tooltipLabel, className = "" }) {
  return (
    <span className={`product-badge ${className}`}>
      {children}

      {tooltipLabel && (
        <span className="product-badge__tooltip">{tooltipLabel}</span>
      )}
    </span>
  );
}
