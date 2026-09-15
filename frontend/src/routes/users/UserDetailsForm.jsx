import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import { ReadOnlyResourceForm } from "../../components/resource-form/ReadOnlyResourceForm.jsx";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
import UsersService from "../../service/UsersService.js";
import { RolesSelectInput } from "./components/RolesSelectInput.jsx";
import { UserTimeline } from "./components/UserTimeline.jsx";

export default WithAuthGuard(function UserDetailsForm() {
  const navigate = useNavigate();

  return (
    <ReadOnlyResourceForm
      fetchResource={async (id) => await UsersService.getById(id)}
      breadcrumbs={[
        { id: "institutional", name: "Institucional" },
        { id: "users", name: "Usuários" },
      ]}
      title="Dados do Usuário"
      gridColumns="repeat(2, 50%)"
      onCancel={() => navigate("/usuarios")}
      actions={<UserTimeline />}
    >
      <InputField
        name="name"
        id="name"
        label="Nome Completo"
        readOnly
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        variant="full"
      />

      <InputField
        name="username"
        id="username"
        label="Nome de Usuário"
        readOnly
        mask={(input) => input.replace(/[^0-9a-z_.-]/gi, "")}
        variant="full"
      />

      <InputField
        name="email"
        id="email"
        label="E-mail"
        readOnly
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        variant="half-left"
      />

      <RolesSelectInput readOnly />
    </ReadOnlyResourceForm>
  );
});