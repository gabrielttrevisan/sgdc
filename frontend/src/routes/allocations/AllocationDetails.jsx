import { useNavigate } from "react-router";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import AllocationsService from "../../service/AllocationsService";
import { AllocationFields } from "./components/AllocationFields";
import { normalizeAllocation } from "./components/allocation-normalizer";

export default WithAuthGuard(function AllocationDetails() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => {
        const response = await AllocationsService.getById(id);

        return response.data
          ? { ...response, data: normalizeAllocation(response.data) }
          : response;
      }}
      breadcrumbs={[{ id: "allocations", name: "Alocações" }]}
      title="Dados da Alocação"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/alocacoes")}
    >
      <AllocationFields readOnly />
    </ReadOnlyResourceForm>
  );
});
