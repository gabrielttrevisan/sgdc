import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider.jsx";
import { ReportDiscardsFilterFormContent } from "./components/ReportDiscardsFilterFormContent.jsx";

export const ReportDiscardsFilterForm = WithAuthGuard(function () {
  return (
    <FormControllerProvider>
      <ReportDiscardsFilterFormContent />
    </FormControllerProvider>
  );
});
