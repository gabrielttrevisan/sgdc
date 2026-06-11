import { createContext, useContext } from "react";

export const FormModalContext = createContext({ mode: "create" });

export function useFormModal() {
  return useContext(FormModalContext);
}
