import { useEffect, useId, useRef } from "react";

/**
 * @typedef {Object} TooltipProps
 * @prop {VoidFunction} [onOpen]
 * @prop {VoidFunction} [onClose]
 * @prop {(isOpen: boolean) => void} [onToggle]
 */

/**
 * @param {import("react").ReactNode} tooltip
 * @param {TooltipProps} [options]
 */
export function useTooltip(tooltip, options = {}) {
  const id = useId();
  /** @type {import("react").RefObject<HTMLElement>} */
  const triggerRef = useRef(null);
  /** @type {import("react").RefObject<HTMLElement>} */
  const tooltipRef = useRef(null);

  const tooltipId = `${id}tooltip`;
  const props = tooltip
    ? {
        triggerProps: {
          popoverTarget: tooltipId,
          popoverTargetAction: "toggle",
        },
        tooltipProps: {
          popover: "auto",
          id: tooltipId,
        },
      }
    : {};

  useEffect(() => {
    if (tooltip && triggerRef.current && tooltipRef.current) {
      const open = () => {
        const buttonRect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const margin = 8;

        tooltipRef.current.style.right = "auto";
        tooltipRef.current.style.bottom = "auto";
        tooltipRef.current.style.boxSizing = "border-box";
        tooltipRef.current.style.maxWidth = `${Math.max(
          0,
          viewportWidth - margin * 2,
        )}px`;
        tooltipRef.current.showPopover();

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const halfTooltipWidth = tooltipRect.width / 2;
        const leftOffset = buttonRect.left + buttonRect.width / 2;
        const minLeft = margin + halfTooltipWidth;
        const maxLeft = viewportWidth - margin - halfTooltipWidth;
        const left = Math.max(minLeft, Math.min(leftOffset, maxLeft));

        const belowTop = buttonRect.bottom + 4;
        const aboveTop = buttonRect.top - tooltipRect.height - 4;
        const top =
          belowTop + tooltipRect.height <= viewportHeight - margin
            ? belowTop
            : aboveTop >= margin
              ? aboveTop
              : Math.max(
                  margin,
                  viewportHeight - margin - tooltipRect.height,
                );

        tooltipRef.current.style.top = `${top}px`;
        tooltipRef.current.style.left = `${left}px`;

        options.onOpen?.();
        options.onToggle?.(true);
      };
      const close = () => {
        tooltipRef.current.hidePopover();

        options.onOpen?.();
        options.onToggle?.(false);
      };

      triggerRef.current.addEventListener("mouseenter", open);
      triggerRef.current.addEventListener("mouseleave", close);

      return () => {
        triggerRef.current?.removeEventListener("mouseenter", open);
        triggerRef.current?.removeEventListener("mouseleave", close);
      };
    }
  }, [tooltip, triggerRef, tooltipRef, options]);

  return {
    triggerRef,
    tooltipRef,
    ...props,
  };
}
