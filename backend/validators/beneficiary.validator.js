/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
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
    required: false,
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
    property: "city",
    validator: "numericId",
    validatorErrorMessage: "Cidade inválido ou não fornecido",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_BENEFICIARY_BODY_RULES = CREATE_BENEFICIARY_RULES.map(
  (rule) => ({ ...rule, required: false }),
);

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_BENEFICIARIES_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      const sortKey = value;

      if (!["name", "request"].includes(sortKey))
        return "Chave de ordenação inválida";

      if (sortKey === "name") {
        if (
          !sortType ||
          typeof sortType !== "string" ||
          sortType.trim().length === 0
        )
          return "Tipo de ordenação não informado";

        if (!["asc", "desc"].includes(sortType))
          return "Tipo de ordenação incompatível com chave de ordenação";
      }

      return true;
    },
  },
];
