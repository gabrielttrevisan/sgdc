import { useRegisterField } from "../context/useRegisterField";
import "./InputField.css";

/**
 * @typedef {Object} InputFieldProps
 * @prop {string} name
 */

/** @type {import("react").FC<Omit<import("react").HTMLProps<"input">, "name" | "type"> & import("../context/FormController").FieldStateInit & InputFieldProps>} */
export const InputHidden = ({
  name,
  mask,
  validate,
  required,
  id,
  ...props
}) => {
  return (
    <input
      name={name}
      id={id}
      {...props}
      type="hidden"
      {...useRegisterField(name, {
        mask,
        validate,
        required,
      })}
    />
  );
};
