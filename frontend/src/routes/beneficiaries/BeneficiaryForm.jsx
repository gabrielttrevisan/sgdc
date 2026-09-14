import { useNavigate } from "react-router";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import BeneficiariesService from "../../service/BeneficiariesService";
import Toast from "../../components/toast/ToastStorage";
import { BeneficiaryFields } from "./components/BeneficiaryFields";

function normalizeBeneficiary(data) {
  return {
    ...data,
    gender: data.gender.id.toLowerCase(),
    state: data.city.state.toLowerCase(),
    city: data.city.id,
  };
}

export default WithAuthGuard(function BeneficiaryForm() {
  const navigate = useNavigate();

  return (
    <ResourceForm
      fetchResource={async (id) => {
        const response = await BeneficiariesService.getById(id);

        return response.data
          ? { ...response, data: normalizeBeneficiary(response.data) }
          : response;
      }}
      breadcrumbs={[{ id: "beneficiaries", name: "Beneficiários" }]}
      title="Cadastrar Beneficiário"
      editTitle="Atualizar Dados do Beneficiário"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/beneficiarios")}
      onSubmit={async (data, isEditing, controller) => {
        const response = isEditing
          ? await BeneficiariesService.edit(data)
          : await BeneficiariesService.create(data);

        if (response.data?.success) {
          Toast.success(
            isEditing
              ? "Beneficiário editado com sucesso"
              : "Beneficiário cadastrado com sucesso",
          );
          navigate("/beneficiarios");
          return true;
        }

        if (response.error?.issues?.length > 0) {
          const [{ description, code }] = response.error.issues;

          if (code === "DUPLICATE_BENEFICIARY") {
            controller.setFieldError(
              "nationalId",
              "CPF já cadastrado no sistema",
            );
          }

          if (description) {
            Toast.error(
              <>
                <strong>
                  Falha ao {isEditing ? "editar" : "cadastrar"} beneficiário
                </strong>
                <br />
                <span>{description}</span>
              </>,
            );
          }
        } else if (response.error) {
          Toast.error(
            `Falha ao ${isEditing ? "editar" : "cadastrar"} beneficiário`,
          );
        }

        return false;
      }}
    >
      <BeneficiaryFields />
    </ResourceForm>
  );
});
