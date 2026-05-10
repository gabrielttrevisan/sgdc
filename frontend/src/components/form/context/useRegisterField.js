import { useFormController } from "./useFormController";

export function useRegisterField(name, stateInit) {
  const controller = useFormController();

  return {
    ref: (instance) => {
      if (instance) controller.pushField(name, stateInit, instance);
    },
  };
}
