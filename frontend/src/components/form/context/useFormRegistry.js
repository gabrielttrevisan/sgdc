import { useFormController } from "./useFormController";

/**
 * @param {import("./FormController").CustomOnSubmitHandler} handler
 * @param {import("./FormController").OnErrorHandler} [errorHandler]
 * @returns {import("react").HTMLProps<'form'>}
 */
export function useFormRegistry(handler, errorHandler) {
  const controller = useFormController();

  return {
    ref: (instance) => {
      if (instance) controller.registerForm(instance);
    },
    onSubmit: controller.handleSubmit(handler, errorHandler),
    onReset: () => controller.reset(),
  };
}
