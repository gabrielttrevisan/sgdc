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
export function Form({ children, onSubmit, ref, ...props }) {
  const registry = useFormRegistry(onSubmit);
  return (
    <form
      {...props}
      {...registry}
      ref={(instance) => {
        typeof registry.ref === "function" && registry.ref(instance);
        if (ref) {
          if (typeof ref === "function") ref(instance);
          else ref.current = instance;
        }
      }}
    >
      {children}
    </form>
  );
}
