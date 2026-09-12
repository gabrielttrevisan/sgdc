import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import UsersService from "../../service/UsersService.js";
import Toast from "../../components/toast/ToastStorage.js";
import {
  RoleAuthGuard,
  WithAuthGuard,
} from "../../components/auth/WithAuthGuard.hoc.jsx";
import { ResourceForm } from "../../components/resource-form/ResourceForm.jsx";
import { unmaskDigits } from "../../lib/functions/unmask.js";
import { isNationalIdValid } from "../../lib/validation/isNationalIdValid.js";
import { RolesSelectInput } from "./components/RolesSelectInput.jsx";

export default WithAuthGuard(function UsersForm() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/usuarios");
  };

  return (
    <ResourceForm
      fetchResource={async (id) => await UsersService.getById(id)}
      breadcrumbs={[
        { id: "intitucional", name: "Institucional" },
        { id: "users", name: "Usuários" },
      ]}
      title="Atualizar Dados do Usuário"
      onCancel={handleCancel}
      gridColumns="repeat(2, 50%)"
      onSubmit={async (data, isEditing) => {
        if (!isEditing) {
          Toast.error("Algo inesperado aconteceu");
          navigate("/usuarios");
          return false;
        }

        const response = await UsersService.edit(data);

        if (response.data?.success) {
          Toast.success("Dados do usuário atualizados com sucesso");
          navigate("/usuarios");
          return true;
        } else if (response.error) {
          Toast.error(
            response.error.issues?.[0]?.description ??
              "Falha ao altualizar dados do usuário",
          );
        }

        return false;
      }}
    >
      <InputField
        name="name"
        required={true}
        id="name"
        label="Nome Completo"
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();
          const message = "Nome inválido";

          if (!trimmed.match(/^([^0-9\d]{2,}\s[^0-9\d]{1,})$/gu))
            return message;

          return true;
        }}
        variant="full"
      />

      <InputField
        name="username"
        required={true}
        id="username"
        label="Nome de Usuário"
        mask={(input) => input.replace(/[^0-9a-z_.-]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();
          const message = "Nome de usuário inválido";

          if (!trimmed.match(/^([0-9a-z_.-]{8,})$/gu)) return message;

          return true;
        }}
        variant="full"
      />

      <InputField
        name="email"
        required={true}
        id="email"
        label="E-mail"
        mask={(input) => input.replace(/[0-9\d]/gi, "")}
        validate={(value) => {
          const trimmed = value.trim();
          const message = "E-mail inválido";

          if (
            !trimmed.match(
              /^([a-z][0-9a-z.\-_]+[a-z0-9]@[a-z][a-z_-]+\.[a-z0-9_\-.]+)$/gi,
            )
          )
            return message;

          return true;
        }}
        variant="half-left"
      />

      <RolesSelectInput />

      <RoleAuthGuard roleId={5}>
        <InputField
          name="password"
          id="password"
          type="password"
          label="Senha Atual"
          validate={(value) => {
            const message = "Senha inválida ou não preenchida";

            if (typeof value !== "string" || value.trim().length === 0)
              return message;

            const trimmed = value.trim();

            if (!/([A-Z])/.test(trimmed)) return message;
            if (!/([0-9])/.test(trimmed)) return message;
            if (!/([!'"@#$%¨&*()_\-+={}[\]^~?/:;>.<,])/.test(trimmed))
              return message;

            return true;
          }}
          variant="half-left"
        />

        <InputField
          name="newPassword"
          id="newPassword"
          type="password"
          label="Nova Senha"
          validate={(value) => {
            const message = "Senha inválida ou não preenchida";

            if (typeof value !== "string" || value.trim().length === 0)
              return message;

            const trimmed = value.trim();

            if (!/([A-Z])/.test(trimmed)) return message;
            if (!/([0-9])/.test(trimmed)) return message;
            if (!/([!'"@#$%¨&*()_\-+={}[\]^~?/:;>.<,])/.test(trimmed))
              return message;

            return true;
          }}
          variant="half-right"
        />
      </RoleAuthGuard>
    </ResourceForm>
  );
});
