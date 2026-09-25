import { RoleAuthGuard } from "../../../components/auth/WithAuthGuard.hoc";
import { InputField } from "../../../components/form/input-field/InputField";
import { useResourceFormContext } from "../../../components/resource-form/context";

export function PasswordChangeField() {
  const { id } = useResourceFormContext();

  return (
    <RoleAuthGuard matchId={id} key={id}>
      <InputField
        name="password"
        id="password"
        type="password"
        label="Senha Atual"
        validate={() => {
          return true;
        }}
        variant="half-left"
        required={true}
      />

      <InputField
        name="newPassword"
        id="newPassword"
        type="password"
        label="Nova Senha"
        validate={(value, state) => {
          if (!state.password && !state.newPassword) return true;

          if (value === state.password)
            return "A nova senha não pode ser igual a senha atual";

          if (typeof value !== "string" || value.trim().length === 0)
            return true;

          const message = "Senha inválida ou não preenchida";
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
