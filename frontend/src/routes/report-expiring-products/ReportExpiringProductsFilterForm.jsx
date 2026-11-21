import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider.jsx";
import { ReportExpiringProductsFilterFormContent } from "./components/ReportExpiringProductsFilterFormContent.jsx";

export const ReportExpiringProductsFilterForm = WithAuthGuard(function () {
  return (
    <FormControllerProvider>
      <ReportExpiringProductsFilterFormContent />
    </FormControllerProvider>
  );
});
