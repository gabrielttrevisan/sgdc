import { useCallback, useState } from "react";
import { useTooltip } from "../../../hooks/useTooltip";

/**
 * @typedef {Object} ActionListButtonProps
 * @prop {import("react").ReactNode} children
 * @prop {boolean} [isXL]
 * @prop {import("react").ReactNode} [tooltip]
 */

/** @type {import("react").FC<Pick<import("../ActionList").ActionConfig, "type" | "className" | "onAction" | "target"> & ActionListButtonProps>} */
export const ActionListButton = ({
  type,
  className = "",
  onAction,
  target,
  children,
  isXL = false,
  tooltip,
  ...props
}) => {
  const [loading, setLoading] = useState();
  const { tooltipRef, triggerRef, tooltipProps, triggerProps } =
    useTooltip(tooltip);

  const loadingClassName = loading ? " --loading" : "";
  const typeClassName = " --" + type;
  const xlClassName = isXL ? " --xl" : "";

  return (
    <>
      <button
        {...props}
        className={`button-block --solid --action${typeClassName}${className}${loadingClassName}${xlClassName}`}
        onClick={useCallback(
          async (e) => {
            setLoading(true);

            await onAction?.(type, target, e);

            setLoading(false);
          },
          [type, target],
        )}
        ref={triggerRef}
        {...triggerProps}
      >
        {children}
      </button>

      {tooltip && (
        <div className="action-tooltip" ref={tooltipRef} {...tooltipProps}>
          {typeof tooltip === "function" ? tooltip(target) : tooltip}
        </div>
      )}
    </>
  );
};
