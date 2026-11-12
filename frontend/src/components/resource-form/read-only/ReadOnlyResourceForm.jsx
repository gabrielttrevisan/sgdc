import { FormControllerProvider } from "../../form/context/FormControllerProvider";
import ReadOnlyResourceFormContent from "./ReadOnlyResourceFormContent";

import "./ReadOnlyResourceForm.css";

export function ReadOnlyResourceForm({ children, ...props }) {
  return (
    <FormControllerProvider>
      <ReadOnlyResourceFormContent {...props}>
        {children}
      </ReadOnlyResourceFormContent>
    </FormControllerProvider>
  );
}
