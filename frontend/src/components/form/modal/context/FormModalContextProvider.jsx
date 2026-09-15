import { FormModalContext } from "./FormModalContext";

export const FormModalContextProvider = ({ mode, isShow, children }) => {
  return <FormModalContext value={{ mode }}>{children}</FormModalContext>;
};
