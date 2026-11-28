import useMatchMedia from "../media-query/useMatchMedia.js";
import { PrintIcon } from "../icons/PrintIcon.jsx";
import { useTooltip } from "../../hooks/useTooltip.js";
import "./PrintButton.css";

export default function PrintButton() {
  const isMobile = useMatchMedia("(max-width: 768px)");
  const tooltip = isMobile ? undefined : "Imprimir";
  const { triggerRef, tooltipRef, triggerProps, tooltipProps } =
    useTooltip(tooltip);

  return (
    <>
      <button
        type="button"
        className="button-block --outline --primary print-button"
        aria-label="Imprimir"
        ref={triggerRef}
        {...triggerProps}
        onClick={() => window.print()}
      >
        <PrintIcon size={16} />
        <span className="print-button__label">Imprimir</span>
      </button>
      {!isMobile && (
        <div className="action-tooltip" ref={tooltipRef} {...tooltipProps}>
          Imprimir
        </div>
      )}
    </>
  );
}
