import { useFormController } from "./useFormController";

/**
 * @param {import("./FormController").CustomOnSubmitHandler} handler
 * @param {import("./FormController").OnErrorHandler} [errorHandler]
 */
export function useFormRegistry(handler, errorHandler) {
  const controller = useFormController();

  return {
    ref: (instance) => {
      if (instance) controller.registerForm(instance, handler, errorHandler);
    },
    onSubmit: controller.handleSubmit(handler, errorHandler),
  };
}
