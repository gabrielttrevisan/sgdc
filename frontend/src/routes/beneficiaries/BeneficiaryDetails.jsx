import { useNavigate } from "react-router";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import BeneficiariesService from "../../service/BeneficiariesService";
import { BeneficiaryFields } from "./components/BeneficiaryFields";

function normalizeBeneficiary(data) {
  return {
    ...data,
    gender: data.gender.id.toLowerCase(),
    state: data.city.state.toLowerCase(),
    city: data.city.id,
  };
}

export default WithAuthGuard(function BeneficiaryDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        const response = await BeneficiariesService.getById(id);

        return response.data
          ? { ...response, data: normalizeBeneficiary(response.data) }
          : response;
      }}
      breadcrumbs={[{ id: "beneficiaries", name: "Beneficiários" }]}
      title="Dados do Beneficiário"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/beneficiarios")}
    >
      <BeneficiaryFields readOnly />
    </ReadOnlyResourceForm>
  );
});
