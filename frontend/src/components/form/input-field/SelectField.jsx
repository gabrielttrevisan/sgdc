import { useRegisterField } from "../context/useRegisterField";
import { ErrorMessage } from "../error-message/ErrorMessage";
import "./InputField.css";

/**
 * @typedef {Object} Option
 * @prop {string} label
 * @prop {string} value
 */

/**
 * @typedef {Object} SelectFieldProps
 * @prop {string} label
 * @prop {string} name
 * @prop {Option[]} options
 * @prop {"full"|"half-left"|"half-right"} [variant]
 */

/** @type {import("react").FC<Omit<import("react").HTMLProps<"input">, "name"> & import("../context/FormController").FieldStateInit & SelectFieldProps>} */
export const SelectField = ({
  name,
  label,
  mask,
  validate,
  required,
  id,
  variant = "full",
  options,
  ...props
}) => {
  return (
    <div className={`input-field ${variant ? "--" + variant : ""}`}>
      <label htmlFor={id}>
        {label}{" "}
        {required ? <span className="input-field__required">*</span> : null}
      </label>

      <select
        name={name}
        id={id}
        {...props}
        type={props.type || "text"}
        {...useRegisterField(name, {
          mask,
          validate,
          required,
        })}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ErrorMessage name={name} />
    </div>
  );
};
