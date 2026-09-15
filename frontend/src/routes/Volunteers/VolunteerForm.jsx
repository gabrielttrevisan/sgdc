import { useNavigate } from "react-router";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import { VolunteerFields } from "./components/VolunteerFields";
import VolunteerService from "../../service/VolunteerService";
import Toast from "../../components/toast/ToastStorage";

export default WithAuthGuard(function VolunteerForm() {
  const navigate = useNavigate();

  return (
    <ResourceForm
      fetchResource={async (id) => {
        return await VolunteerService.getById(id);
      }}
      breadcrumbs={[
        {
          id: "volunteers",
          name: "Voluntários",
        },
      ]}
      title="Cadastrar Voluntário"
      editTitle="Atualizar Dados do Voluntário"
      gridColumns="1fr 1fr"
      onCancel={() => navigate("/voluntarios")}
      onSubmit={async (data, isEditing, controller) => {
        const response = isEditing
          ? await VolunteerService.edit(data)
          : await VolunteerService.create(data);

        if (response.data?.success) {
          Toast.success(
            isEditing
              ? "Voluntário editado com sucesso"
              : "Voluntário cadastrado com sucesso",
          );

          navigate("/voluntarios");
          return true;
        }

        if (response.error?.issues?.length > 0) {
          const [{ description, code }] = response.error.issues;

          if (code === "DUPLICATE_FIELD") {
            controller.setFieldError(
              "nationalId",
              "CPF já cadastrado no sistema",
            );
          }

          if (description) {
            Toast.error(
              <>
                <strong>
                  Falha ao {isEditing ? "editar" : "cadastrar"} voluntário
                </strong>
                <br />
                <span>{description}</span>
              </>,
            );
          }
        } else if (response.error) {
          Toast.error(
            `Falha ao ${isEditing ? "editar" : "cadastrar"} voluntário`,
          );
        }

        return false;
      }}
    >
      <VolunteerFields />
    </ResourceForm>
  );
});