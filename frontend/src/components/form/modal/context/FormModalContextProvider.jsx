import { FormModalContext } from "./FormModalContext";

export const FormModalContextProvider = ({ mode, children }) => {
  return <FormModalContext value={{ mode }}>{children}</FormModalContext>;
};
