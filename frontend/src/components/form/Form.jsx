import { useCallback } from "react";
import { useFormController } from "./context/useFormController";

/**
 * @template FieldData
 * @callback OnSubmitHandler
 * @param {FieldData} data
 * @param {SubmitEvent} event
 */

/**
 * @template FieldData
 * @typedef {Object} FromProps
 * @prop {import("react").Reactnode} children
 * @prop {OnSubmitHandler<FieldData>} onSubmit
 */

/**
 * @template FieldData
 * @param {FromProps<FieldData> & Omit<import("react").HTMLProps<"form">, "onSubmit">} param0
 * @returns {import("react").JSX.Element}
 */
export function Form({ children, onSubmit, ...props }) {
  const controller = useFormController();

  const handleSubmit = useCallback(
    /**
     * @param {SubmitEvent} e
     */
    (e) => {
      e.preventDefault();

      onSubmit({}, e);
    },
    [onSubmit],
  );

  return (
    <form
      ref={(form) => controller.setForm(form)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
}
