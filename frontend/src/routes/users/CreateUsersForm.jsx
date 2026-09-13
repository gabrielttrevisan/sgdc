import { useNavigate } from "react-router";
import { InputField } from "../../components/form/input-field/InputField.jsx";
import UsersService from "../../service/UsersService.js";
import Toast from "../../components/toast/ToastStorage.js";
import { WithAuthGuard } from "../../components/auth/WithAuthGuard.hoc.jsx";
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
      breadcrumbs={[
        { id: "intitucional", name: "Institucional" },
        { id: "users", name: "Usuários" },
      ]}
      title="Cadastrar Usuário"
      onCancel={handleCancel}
      gridColumns="repeat(2, 50%)"
      onSubmit={async (data) => {
        const response = await UsersService.create(data);

        if (response.data?.success) {
          Toast.success("Usuário cadastrado com sucesso");
          navigate("/usuarios");
          return true;
        } else if (response.error) {
          Toast.error(
            response.error.issues?.[0]?.description ??
              "Falha ao cadastrar usuário",
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

          if (!trimmed.match(/^([0-9a-z_.-]{4,})$/gu)) return message;

          return true;
        }}
        variant="half-left"
      />

      <InputField
        name="cpf"
        required={true}
        id="cpf"
        label="CPF"
        inputMode="numeric"
        variant="half-right"
        mask={(input) =>
          unmaskDigits(input)
            .slice(0, 11)
            .replace(
              /(\d{1,3})(\d{1,3})(\d{1,3})(\d{1,2})/gi,
              (_all, one, two, three, four) => {
                if (four) return `${one}.${two}.${three}-${four}`;
                else if (three) return `${one}.${two}.${three}`;
                else if (two) return `${one}.${two}`;

                return one;
              },
            )
        }
        validate={(value) => {
          const trimmed = unmaskDigits(value);
          const message = "CPF inválido";

          if (trimmed.length < 11) return message;

          return isNationalIdValid(trimmed) || message;
        }}
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

      <InputField
        name="password"
        required={true}
        id="password"
        type="password"
        label="Senha"
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
        name="passwordConfirm"
        required={true}
        id="passwordConfirm"
        type="password"
        label="Confirmação de Senha"
        validate={(value, fields) => {
          if (value !== fields.password)
            return "A confirmação de senha deve ser idêntica a senha";

          return true;
        }}
        variant="half-right"
      />
    </ResourceForm>
  );
});
