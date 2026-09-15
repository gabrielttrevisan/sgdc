import { useFormController } from "../../context/useFormController";
import { useFormLoading } from "../../context/useFormLoading";
import { useFormValidity } from "../../context/useFormValidity";

/**
 * @typedef {Object} FormModalButtonProps
 * @prop {boolean} hidden
 * @prop {boolean} disabled
 * @prop {import("react").ReactNode} children
 * @prop {string} [className]
 */

/**
 * @param {FormModalButtonProps} props
 * @returns {import("react").JSX.Element}
 */
export function FormModalSubmitButton({
  hidden = false,
  disabled = false,
  children,
  className = "",
  onClick,
  ...props
}) {
  const controller = useFormController();
  const isLoading = useFormLoading();

  return (
    <button
      type="submit"
      className={`button-block --solid --primary ${className} ${isLoading ? "--loading" : ""}`}
      disabled={isLoading || disabled}
      hidden={hidden}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        controller.validateAll();
      }}
    >
      {children}
    </button>
  );
}
