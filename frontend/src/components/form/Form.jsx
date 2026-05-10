import { useFormRegistry } from "./context/useFormRegistry";

/**
 * @typedef {Object} FromProps
 * @prop {import("react").Reactnode} children
 * @prop {import("./context/FormController").CustomOnSubmitHandler} onSubmit
 */

/**
 * @param {FromProps & Omit<import("react").HTMLProps<"form">, "onSubmit">} param0
 * @returns {import("react").JSX.Element}
 */
export function Form({ children, onSubmit, ...props }) {
  return (
    <form {...props} {...useFormRegistry(onSubmit, console.log)}>
      {children}
    </form>
  );
}
