import { useFormLoading } from "../../context/useFormLoading";

/**
 * @typedef {Object} FormModalCancelButtonProps
 * @prop {boolean} hidden
 * @prop {boolean} disabled
 * @prop {import("react").ReactNode} children
 * @prop {string} [className]
 */

/**
 * @param {FormModalCancelButtonProps} props
 * @returns {import("react").JSX.Element}
 */
export function FormModalCancelButton({ children, disabled, ...props }) {
  const isLoading = useFormLoading();

  return (
    <button type="reset" disabled={isLoading || disabled} {...props}>
      {children}
    </button>
  );
}
