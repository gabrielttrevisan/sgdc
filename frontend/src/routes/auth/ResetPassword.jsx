import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { InputField } from "../../components/form/input-field/InputField";
import { Form } from "../../components/form/Form";
import { FormModalSubmitButton } from "../../components/form/modal/button/FormModalSubmitButton";
import { FormControllerProvider } from "../../components/form/context/FormControllerProvider";
import { unmaskDigits } from "../../lib/functions/unmask";
import { isNationalIdValid } from "../../lib/validation/isNationalIdValid";
import Toast from "../../components/toast/ToastStorage";
import AuthService from "../../service/AuthService";

import "../../components/resource-form/InlineForm.css";
import "./SignIn.css";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const missingTokenHandled = useRef(false);

  useEffect(() => {
    if (!token && !missingTokenHandled.current) {
      missingTokenHandled.current = true;
      Toast.error(
        "O link de recuperação não contém um token. Solicite um novo token.",
      );
      navigate("/sign-in", { replace: true });
    }
  }, [navigate, token]);

  const handleSubmit = async ({ cpf, pass, confirmPass }) => {
    const response = await AuthService.resetPassword({
      cpf: unmaskDigits(cpf),
      pass,
      confirmPass,
      token,
    });

    if (response.data) {
      Toast.success("Senha redefinida com sucesso");
      navigate("/sign-in", { replace: true });
      return true;
    }

    if (response.error) {
      const message =
        response.error.issues?.[0]?.description ??
        response.error.message ??
        "Não foi possível redefinir a senha";
      const normalizedMessage = message.toLocaleLowerCase("pt-BR");

      if (
        normalizedMessage.includes("token") &&
        (normalizedMessage.includes("expir") ||
          normalizedMessage.includes("inválid") ||
          normalizedMessage.includes("inexist"))
      ) {
        Toast.error(
          "O token de recuperação é inválido, expirou ou não existe. Solicite um novo token.",
        );
        navigate("/sign-in", { replace: true });
        return false;
      }

      Toast.error(message);
      return false;
    }

    Toast.error("Não foi possível redefinir a senha");
    return false;
  };

  if (!token) return null;

  return (
    <FormControllerProvider>
      <div className="sign-in-form__wrapper">
        <Form onSubmit={handleSubmit} className="sign-in-form">
          <h1>Recuperar senha</h1>

          <InputField
            name="cpf"
            required
            id="cpf"
            label="CPF"
            placeholder="000.000.000-00"
            inputMode="numeric"
            mask={(input) =>
              unmaskDigits(input)
                .slice(0, 11)
                .replace(
                  /(\d{1,3})(\d{1,3})(\d{1,3})(\d{1,2})/gi,
                  (_all, one, two, three, four) => {
                    if (four) return `${one}.${two}.${three}-${four}`;
                    if (three) return `${one}.${two}.${three}`;
                    if (two) return `${one}.${two}`;

                    return one;
                  },
                )
            }
            variant="full"
            validate={(value) => {
              const digits = unmaskDigits(value);
              const message = "CPF inválido";

              if (digits.length < 11) return message;

              return isNationalIdValid(digits) || message;
            }}
          />

          <InputField
            name="pass"
            required
            id="pass"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            variant="full"
            validate={(value) => {
              if (value.length < 8)
                return "A senha deve ter pelo menos 8 caracteres";
              if (!/[a-z]/.test(value))
                return "A senha deve conter uma letra minúscula";
              if (!/[A-Z]/.test(value))
                return "A senha deve conter uma letra maiúscula";
              if (!/\d/.test(value)) return "A senha deve conter um número";
              if (!/[^a-zA-Z0-9]/.test(value))
                return "A senha deve conter um caractere especial";

              return true;
            }}
          />

          <InputField
            name="confirmPass"
            required
            id="confirmPass"
            label="Confirme a nova senha"
            type="password"
            autoComplete="new-password"
            variant="full"
            validate={(value, state) => {
              if (!value) return "Confirme a nova senha";

              return value === state.pass
                ? true
                : "A senha e a confirmação de senha não coincidem";
            }}
          />

          <footer>
            <FormModalSubmitButton>
              <span>Redefinir senha</span>
            </FormModalSubmitButton>
          </footer>
        </Form>
      </div>
    </FormControllerProvider>
  );
}
