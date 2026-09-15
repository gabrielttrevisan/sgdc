import { useRegisterField } from "../context/useRegisterField";
import "./InputField.css";

/**
 * @typedef {Object} CheckboxFieldProps
 * @prop {string} label
 * @prop {string} name
 * @prop {number} [id]
 */

/** @type {React.FC<CheckboxFieldProps>} */
export const CheckboxField = ({
  name,
  label,
  id,
  ...props
}) => {
  return (
    <div className="checkbox-field">
      <label htmlFor={id}>
        <input
          type="checkbox"
          name={name}
          id={id}
          {...props}
          {...useRegisterField(name, {})}
        />

        <span>{label}</span>
      </label>
    </div>
  );
};