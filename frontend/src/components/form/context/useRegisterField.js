import InputFieldController from "./field-controller/InputFieldController";
import SelectFieldController from "./field-controller/SelectFieldController";
import { useFormController } from "./useFormController";

/**
 *
 * @param {string} name
 * @param {import("../context/FormController").FieldStateInit} stateInit
 * @returns
 */
export function useRegisterField(name, stateInit) {
  const controller = useFormController();

  return {
    ref: (instance) => {
      if (instance) {
        const controllerInterface =
          instance instanceof HTMLInputElement
            ? new InputFieldController(instance)
            : instance instanceof HTMLSelectElement
              ? new SelectFieldController(instance)
              : instance;

        controller.registerField(name, stateInit, controllerInterface);
      }
    },
  };
}
