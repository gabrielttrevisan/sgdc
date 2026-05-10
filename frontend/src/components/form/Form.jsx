import { useFormRegistry } from "./context/useFormRegistry";

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
  return (
    <form {...props} {...useFormRegistry(onSubmit, console.log)}>
      {children}
    </form>
  );
}
