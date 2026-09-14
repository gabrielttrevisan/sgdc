import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { TextAreaField } from "../../components/form/input-field/TextAreaField";
import { PermissionsTableField } from "../../components/form/input-field/PermissionsTableField";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import RolesService from "../../service/RolesService";

export default WithAuthGuard(function RoleDetailsForm() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => await RolesService.getById(id)}
      breadcrumbs={[
        { id: "institutional", name: "Institucional" },
        { id: "roles", name: "Níveis de acesso" },
      ]}
      title="Dados do Nível de Acesso"
      onCancel={() => navigate("/niveis-de-acesso")}
    >
      <InputField
        name="name"
        id="name"
        label="Título"
        readOnly
        variant="full"
      />

      <TextAreaField
        name="description"
        id="description"
        label="Descrição"
        readOnly
        variant="full"
      />

      <PermissionsTableField readOnly />
    </ReadOnlyResourceForm>
  );
});