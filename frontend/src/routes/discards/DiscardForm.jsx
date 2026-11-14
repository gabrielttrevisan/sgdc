import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ProductQuantitiesProvider } from "../families/components/product-quantity/provider.jsx";
import DiscardFormContent from "./components/DiscardFormContent.jsx";

export default WithAuthGuard(function DiscardForm() {
  return (
    <ProductQuantitiesProvider>
      <DiscardFormContent />
    </ProductQuantitiesProvider>
  );
});
