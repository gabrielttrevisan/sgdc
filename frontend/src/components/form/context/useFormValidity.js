import { useEffect, useState } from "react";
import { useFormController } from "./useFormController";

export function useFormValidity() {
  const controller = useFormController();
  const [validity, setValidity] = useState(false);

  useEffect(() => {
    controller.addEventListener("form-validity", (e) => {
      setValidity(e.detail.isValid);
    });
  }, [controller]);

  return validity;
}
