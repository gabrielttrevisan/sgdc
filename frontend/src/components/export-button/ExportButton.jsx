import { useImperativeHandle, useState } from "react";
import { ExcelFileIcon } from "../icons/ExcelFileIcon";
import { CSVIcon } from "../icons/CSVIcon";
import { TriangleDownIcon } from "../icons/TriangleDownIcon";
import { useTooltip } from "../../hooks/useTooltip";
import { FORMAT } from "./export-format";

import "./ExportButton.css";

export default function ExportButton({ ref, exportProps, formatProps, ...props }) {
  const [format, setFormat] = useState(FORMAT.XLS);
  const tooltip = format === FORMAT.XLS ? "Planilha do Excel" : "Arquivo CSV";
  const { tooltipRef, triggerRef, tooltipProps, triggerProps } =
    useTooltip(tooltip);

  const handleToggleFormat = () => {
    setFormat((prev) => {
      if (prev === FORMAT.XLS) return FORMAT.CSV;

      return FORMAT.XLS;
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      get format() {
        return format;
      },
    }),
    [format],
  );

  return (
    <div className="export-button" {...props}>
      <button
        type="button"
        className="export-button__format-icon button-block --outline --btn-safe"
        data-format={format}
        ref={triggerRef}
        onClick={handleToggleFormat}
        {...triggerProps}
        {...formatProps}
      >
        <ExcelFileIcon className="export-button__excel-icon" />
        <CSVIcon className="export-button__csv-icon" />
        <TriangleDownIcon />
      </button>

      <div className="action-tooltip" ref={tooltipRef} {...tooltipProps}>
        {tooltip}
      </div>

      <button type="button" className="button-block --solid --btn-safe" {...exportProps}>
        <span>Exportar como {tooltip}</span>
      </button>
    </div>
  );
}
