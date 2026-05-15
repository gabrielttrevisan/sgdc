import { useRegisterField } from "../context/useRegisterField";
import { ErrorMessage } from "../error-message/ErrorMessage";
import "./InputField.css";

/**
 * @typedef {Object} InputFieldProps
 * @prop {string} label
 * @prop {string} name
 * @prop {"full"|"half-left"|"half-right"} [variant]
 */

/** @type {import("react").FC<Omit<import("react").HTMLProps<"input">, "name"> & import("../context/FormController").FieldStateInit & InputFieldProps>} */
export const InputField = ({
  name,
  label,
  mask,
  validate,
  required,
  id,
  variant = "full",
  ...props
}) => {
  return (
    <div className={`input-field ${variant ? "--" + variant : ""}`}>
      <label htmlFor={id}>
        {label}{" "}
        {required ? <span className="input-field__required">*</span> : null}
      </label>

      <input
        name={name}
        id={id}
        {...props}
        type={props.type || "text"}
        {...useRegisterField(name, {
          mask,
          validate,
          required,
        })}
      />

      <ErrorMessage name={name} />
    </div>
  );
};
