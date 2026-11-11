import { AddLargeIcon } from "../icons/AddLargeIcon";
import { SubtractIcon } from "../icons/SubtractIcon";
import { VisuallyHidden } from "../accessibility/visually-hidden/VisuallyHidden";
import { useState } from "react";

import "./UIntField.css";

export default function UIntField({
  label,
  name,
  id,
  onIncrease,
  onDecrease,
  defaultValue = 0,
  step = 1,
}) {
  const [count, setCount] = useState(defaultValue);

  const handleIncrease = (e) => {
    onIncrease?.(count + step, e);
    setCount((prev) => prev + step);
  };

  const handleDecrease = (e) => {
    const newValue = count - step;
    const uintNewValue = newValue < 0 ? 0 : newValue;

    onDecrease?.(uintNewValue, e);
    setCount((prev) => {
      const newValue = prev - step;
      const uintNewValue = newValue < 0 ? 0 : newValue;

      return uintNewValue;
    });
  };

  const handleChange = (e) => {
    const value = e.currentTarget.asNumber;
    const quantity =
      isNaN(value) || !isFinite(value) || value < 0 ? defaultValue : value;

    if (quantity >= count) onIncrease?.(quantity, e);
    else onDecrease?.(quantity, e);
  };

  return (
    <div className="uint-field">
      <VisuallyHidden id={`uint-field:label:${id}`}>{label}</VisuallyHidden>

      <button
        type="button"
        className="uint-field__decrease "
        onClick={handleDecrease}
      >
        <SubtractIcon />
      </button>

      <input
        type="text"
        inputMode="numeric"
        name={name}
        id={id}
        aria-labelledby={`uint-field:label:${id}`}
        value={count}
        onChange={handleChange}
      />

      <button
        type="button"
        className="uint-field__increase"
        onClick={handleIncrease}
      >
        <AddLargeIcon />
      </button>
    </div>
  );
}
