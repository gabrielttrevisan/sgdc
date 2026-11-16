/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const SIGN_IN_RULES = [
  {
    property: "user",
    validate: (value) =>
      typeof value === "string" && value.trim()
        ? true
        : "Informe o e-mail, CPF ou nome de usuário",
  },
  {
    property: "pass",
    validate: (value) =>
      typeof value === "string" && value.length > 0
        ? true
        : "Informe a senha",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const RECOVERY_TOKEN_RULES = [
  {
    property: "user",
    validate: (value) =>
      typeof value === "string" && value.trim()
        ? true
        : "Informe o e-mail, CPF ou nome de usuário",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const RESET_PASSWORD_RULES = [
  {
    property: "cpf",
    validator: "nationalId",
  },
  {
    property: "token",
    validate: (value) =>
      typeof value === "string" && value.trim()
        ? true
        : "Token inválido ou não fornecido",
  },
  {
    property: "pass",
    validate: (value) => {
      if (typeof value !== "string" || value.length < 8)
        return "A senha deve ter pelo menos 8 caracteres";

      if (!/[a-z]/.test(value)) return "A senha deve conter uma letra minúscula";
      if (!/[A-Z]/.test(value)) return "A senha deve conter uma letra maiúscula";
      if (!/\d/.test(value)) return "A senha deve conter um número";
      if (!/[^a-zA-Z0-9]/.test(value))
        return "A senha deve conter um caractere especial";

      return true;
    },
  },
  {
    property: "confirmPass",
    validate: (value, target) => {
      if (typeof value !== "string" || !value)
        return "Informe a confirmação de senha";

      return value === target.pass
        ? true
        : "A senha e a confirmação de senha não coincidem";
    },
  },
];
