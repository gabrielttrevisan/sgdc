/**
 * @typedef {FieldValidityState}
 * @prop {boolean} isValid
 * @prop {boolean} isTouched
 * @prop {string|null} errorMessage
 */

import { useEffect, useState } from "react";
import { useFormController } from "./useFormController";

/**
 * @param {string} name
 */
export function useFieldValidityState(name) {
  const [validity, setValidity] = useState({
    isValid: false,
    isTouched: false,
    errorMessage: null,
  });
  const controller = useFormController();

  useEffect(() => {
    controller.addEventListener(`validity-change:${name}`, (e) => {
      setValidity(e.detail);
    });
  }, [controller]);

  return validity;
}
