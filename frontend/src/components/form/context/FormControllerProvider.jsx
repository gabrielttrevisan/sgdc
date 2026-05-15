import FormController from "./FormController";
import { FormControllerContext } from "./FormControllerContext";

export const FormControllerProvider = ({ children }) => {
  return (
    <FormControllerContext value={FormController.create()}>
      {children}
    </FormControllerContext>
  );
};
