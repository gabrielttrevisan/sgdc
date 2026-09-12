import { RoleAuthGuard } from "../../../components/auth/WithAuthGuard.hoc";
import { InputField } from "../../../components/form/input-field/InputField";
import { useResourceFormContext } from "../../../components/resource-form/context";

export function PasswordChangeField() {
  const { id } = useResourceFormContext();

  return (
    <RoleAuthGuard roleId={5} matchId={id} key={id}>
      <InputField
        name="password"
        id="password"
        type="password"
        label="Senha Atual"
        validate={() => {
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
  );
}
