import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { PermissionsTableField } from "../../components/form/input-field/PermissionsTableField";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import RolesService from "../../service/RolesService";
import Toast from "../../components/toast/ToastStorage";

export default WithAuthGuard(function RolesForm() {
  const navigate = useNavigate();

  return (
    <ResourceForm
      breadcrumbs={[
        { id: "institutional", name: "Institucional" },
        { id: "roles", name: "Níveis de acesso" },
      ]}
      title="Cadastrar Nível de Acesso"
      onCancel={() => navigate("/niveis-de-acesso")}
      onSubmit={async (data) => {
        const response = await RolesService.create({
          ...data,
          permissions: JSON.parse(data.permissions),
        });

        if (response.data?.success) {
          Toast.success("Nível de acesso cadastrado com sucesso");
          navigate("/niveis-de-acesso");
          return true;
        }

        if (response.error)
          Toast.error(
            response.error.issues?.[0]?.description ??
              "Falha ao cadastrar nível de acesso",
          );

        return false;
      }}
    >
      <InputField
        name="name"
        required
        id="name"
        label="Título"
        maxLength={64}
        mask={(value) => value.replace(/[^\p{L}\s]/gu, "")}
        validate={(value) =>
          value.trim().length > 0 ? true : "O título é obrigatório"
        }
      />

      <TextAreaField
        name="description"
        id="description"
        label="Descrição"
        maxLength={128}
        variant="full"
      />

      <PermissionsTableField />
    </ResourceForm>
  );
});
