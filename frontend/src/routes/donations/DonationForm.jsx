import { useParams } from "react-router";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ProductQuantitiesProvider } from "../families/components/product-quantity/provider.jsx";
import DonationFormContent from "./components/DonationFormContent.jsx";

export default WithAuthGuard(function DonationForm() {
  const { beneficiaryId } = useParams();
  return (
    <ProductQuantitiesProvider key={beneficiaryId}>
      <DonationFormContent />
    </ProductQuantitiesProvider>
  );
});
