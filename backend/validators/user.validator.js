/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_USER_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome inválido ou não fornecido";

      if (typeof value !== "string" || value.trim().length === 0)
        return message;

      const trimmed = value.trim();

      if (!trimmed.match(/^([^0-9\d]{2,}\s[^0-9\d]{1,})$/gu)) return message;

      return true;
    },
  },
  {
    property: "nationalId",
    validator: "nationalId",
  },
  {
    property: "email",
    validator: "email",
  },
  {
    property: "pass",
    validate: (value) => {
      const message = "Senha inválido ou não fornecido";

      if (typeof value !== "string" || value.trim().length === 0)
        return message;

      const trimmed = value.trim();

      if (!/([A-Z])/.test(trimmed)) return message;
      if (!/([0-9])/.test(trimmed)) return message;
      if (!/([!'"@#$%¨&*()\_\-\+={}\[\]^~?\/:;>.<,])/.test(trimmed))
        return message;

      return true;
    },
  },
  {
    property: "roleId",
    validator: "numericId",
  },
];
