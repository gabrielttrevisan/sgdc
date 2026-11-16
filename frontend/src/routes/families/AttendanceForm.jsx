import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ProductQuantitiesProvider } from "./components/product-quantity/provider.jsx";
import { AttendanceForm } from "./components/attendance-form/AttendanceForm.jsx";
import { useParams } from "react-router";

export default WithAuthGuard(function AttendanceFormRoute() {
  const { id } = useParams();

  return (
    <ProductQuantitiesProvider key={id}>
      <AttendanceForm />
    </ProductQuantitiesProvider>
  );
});
