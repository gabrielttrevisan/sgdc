import { useRegisterField } from "../context/useRegisterField";
import { ErrorMessage } from "../error-message/ErrorMessage";
import "./InputField.css";

/**
 * @typedef {Object} InputFieldProps
 * @prop {string} label
 * @prop {string} name
 */

/** @type {import("react").FC<Omit<import("react").HTMLProps<"input">, "name"> & import("../context/FormController").FieldStateInit>} */
export const InputField = ({
  name,
  label,
  mask,
  validate,
  required,
  id,
  ...props
}) => {
  return (
    <div className="input-field">
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
