import { useContext } from "react";
import { FormControllerContext } from "./FormControllerContext";

export function useFormController() {
  const controller = useContext(FormControllerContext);

  if (!controller)
    throw new Error(
      "useFormController must be used within FormControllerProvider",
    );

  return controller;
}
