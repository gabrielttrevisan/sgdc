import { useFormController } from "./useFormController";

/**
 * @param {import("./FormController").CustomOnSubmitHandler} handler
 * @param {import("./FormController").OnErrorHandler} [errorHandler]
 * @returns {Pick<import("react").HTMLProps<'form'>, "onSubmit" | "onReset">&{ref:(form:HTMLFormElement|null)=>void}}
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
