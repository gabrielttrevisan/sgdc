import { useRegisterField } from "../context/useRegisterField";
import { ErrorMessage } from "../error-message/ErrorMessage";
import "./InputField.css";

/**
 * @typedef {Object} TextAreaFieldProps
 * @prop {string} label
 * @prop {string} name
 * @prop {"full"|"half-left"|"half-right"} [variant]
 */

/** @type {import("react").FC<Omit<import("react").HTMLProps<"textarea">, "name"> & import("../context/FormController").FieldStateInit & TextAreaFieldProps>} */
export const TextAreaField = ({
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

      <textarea
        name={name}
        id={id}
        {...props}
        {...useRegisterField(name, {
          mask,
          validate,
          required,
        })}
      ></textarea>

      <ErrorMessage name={name} />
    </div>
  );
};
