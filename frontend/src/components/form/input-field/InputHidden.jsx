import { useRegisterField } from "../context/useRegisterField";

/** @type {import("react").FC<Omit<import("react").HTMLProps<"input">, "type"> & import("../context/FormController").FieldStateInit>} */
export const InputHidden = ({ name, mask, validate, required, ...props }) => {
  return (
    <input
      name={name}
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
