import { useEffect, useState } from "react";
import { useFormController } from "./useFormController";

export function useFormLoading() {
  const controller = useFormController();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateLoading = (e) => {
      setLoading(e.detail.isSubmitting);
    };

    controller.addEventListener("form-submit", updateLoading);

    return () => {
      controller.removeEventListener("form-submit", updateLoading);
    };
  }, [controller]);

  return loading;
}
