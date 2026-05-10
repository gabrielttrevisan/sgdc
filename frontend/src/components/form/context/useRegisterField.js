import { useFormController } from "./useFormController";

export function useRegisterField(name, stateInit) {
  const controller = useFormController();

  return {
    ref: (instance) => {
      if (instance) controller.registerField(name, stateInit, instance);
    },
  };
}
