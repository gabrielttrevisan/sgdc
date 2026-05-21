/** @type {import("../middlewares/validator").ValidationRule[]} */
export const CREATE_BENEFICIARY_RULES = [
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
    property: "gender",
    validate: (value) => {
      const message = "Sexo inválido";

      if (typeof value !== "string" || value.trim().length === 0)
        return message;

      const trimmed = value.trim();

      if (!trimmed.match(/^(o|m|f)$/i)) return message;

      return true;
    },
  },
  {
    property: "nationalId",
    validator: "nationalId",
  },
  {
    property: "phone",
    validator: "phone",
  },
  {
    property: "street",
    validate: (value) => {
      if (typeof value !== "string") return "Logradouro não fornecido";

      const trimmed = value.trim();

      if (trimmed.length < 4) return "Logradouro muito curto";
      else if (trimmed.length > 140) return "Logradouro muito longo";

      return true;
    },
  },
  {
    property: "number",
    validate: (value) => {
      if (typeof value !== "string") return "Número não fornecido";

      const trimmed = value.trim();

      if (!trimmed.length) return "Número inválido";

      return true;
    },
  },
  {
    property: "complement",
    validate: (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim();

        if (!trimmed.length) return "Complemento inválido";

        return true;
      }

      return true;
    },
  },
  {
    property: "neighborhood",
    validate: (value) => {
      const message = "Bairro inválido ou não fornecido";

      if (typeof value !== "string") return message;

      const trimmed = value.trim();

      if (!trimmed.length) return message;

      return true;
    },
  },
  {
    property: "state",
    validate: (value) => {
      const message = "Estado inválido ou não fornecido";

      if (typeof value !== "string") return message;

      const trimmed = value.trim();

      if (trimmed.length !== 2) return message;

      return true;
    },
  },

  {
    property: "city",
    validator: "numericId",
    validatorErrorMessage: "Cidade inválido ou não fornecido",
  },
];
