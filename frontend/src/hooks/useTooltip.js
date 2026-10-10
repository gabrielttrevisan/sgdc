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

        tooltipRef.current.showPopover();
        tooltipRef.current.style.top = buttonRect.bottom + 4 + "px";
        tooltipRef.current.style.left =
          buttonRect.left + Math.floor(buttonRect.width / 2) + "px";

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
