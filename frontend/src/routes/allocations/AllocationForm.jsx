import { useNavigate, useParams } from "react-router";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import Toast from "../../components/toast/ToastStorage";
import AllocationsService from "../../service/AllocationsService";
import { AllocationFields } from "./components/AllocationFields";
import { normalizeAllocation } from "./components/allocation-normalizer";

export default WithAuthGuard(function AllocationForm() {
  const navigate = useNavigate();
  const { volunteerId } = useParams();
  const goToOrigin = () =>
    navigate(volunteerId ? "/voluntarios" : "/alocacoes");

  return (
    <ResourceForm
      fetchResource={async (id) => {
        const response = await AllocationsService.getById(id);

        return response.data
          ? { ...response, data: normalizeAllocation(response.data) }
          : response;
      }}
      breadcrumbs={[{ id: "allocations", name: "Alocações" }]}
      title="Cadastrar Alocação"
      editTitle="Atualizar Alocação"
      gridColumns="1fr 1fr"
      onCancel={goToOrigin}
      onSubmit={async (data, isEditing) => {
        const response = isEditing
          ? await AllocationsService.edit(data)
          : await AllocationsService.create(data);

        if (response.data?.success) {
          Toast.success(
            isEditing
              ? "Alocação atualizada com sucesso"
              : "Alocação cadastrada com sucesso",
          );

          navigate("/alocacoes");
          return true;
        }

        const issues = response.error?.issues ?? [];
        const description = issues[0]?.description;

        Toast.error(
          description ? (
            <>
              <strong>
                Falha ao {isEditing ? "atualizar" : "cadastrar"} alocação
              </strong>
              <br />
              <span>{description}</span>
            </>
          ) : (
            `Falha ao ${isEditing ? "atualizar" : "cadastrar"} alocação`
          ),
        );

        return false;
      }}
    >
      <AllocationFields />
    </ResourceForm>
  );
});
