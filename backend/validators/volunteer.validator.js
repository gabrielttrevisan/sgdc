/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_VOLUNTEER_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome de voluntário inválido";
      if (typeof value !== "string") return message;
      const trimmed = value.trim();
      if (trimmed.length === 0 || !trimmed.match(/^([-A-zÀ-ž\s]+)$/i)) return message;
      return true;
    },
  },
  {
    property: "gender",
    validate: (value) => {
      const message = "Gênero inválido. Deve ser 'm', 'f' ou 'o'";
      if (typeof value !== "string") return message;
      const trimmed = value.trim().toLowerCase();
      if (!["m", "f", "o"].includes(trimmed)) return message;
      return true;
    },
  },
  {
    property: "nationalId",
    validator: "nationalId",
    validatorErrorMessage: "CPF inválido ou não fornecido",
  },
  {
    property: "phone",
    validator: "phone",
    validatorErrorMessage: "Telefone principal inválido ou não fornecido",
  },
  {
    property: "phoneSecondary",
    required: false,
    validator: "phone",
    validatorErrorMessage: "Telefone secundário inválido",
  },
  {
    property: "hasWhatsApp",
    validate: (value) => {
      if (typeof value !== "boolean") return "Campo hasWhatsApp deve ser booleano";
      return true;
    },
  },
  {
    property: "hasWhatsAppSecondary",
    validate: (value) => {
      if (typeof value !== "boolean") return "Campo hasWhatsAppSecondary deve ser booleano";
      return true;
    },
  },
  {
    property: "street",
    validate: (value) => {
      if (typeof value !== "string" || value.trim().length === 0) return "Rua inválida";
      return true;
    },
  },
  {
    property: "number",
    validate: (value) => {
      if (typeof value !== "string" || value.trim().length === 0) return "Número residencial inválido";
      return true;
    },
  },
  {
    property: "complement",
    required: false,
    validate: (value) => {
      if (value !== undefined && typeof value !== "string") return "Complemento inválido";
      return true;
    },
  },
  {
    property: "neighborhood",
    validate: (value) => {
      if (typeof value !== "string" || value.trim().length === 0) return "Bairro inválido";
      return true;
    },
  },
  {
    property: "city",
    validate: (value) => {
      if (typeof value !== "string" || value.trim().length === 0) return "Cidade inválida";
      return true;
    },
  },
  {
    property: "state",
    validator: "state",
    validatorErrorMessage: "Estado inválido (deve conter 2 caracteres)",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_VOLUNTEER_BODY_RULES = CREATE_VOLUNTEER_RULES.map((rule) => ({
  ...rule,
  required: false,
}));

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_VOLUNTEERS_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;
      const sortKey = value;

      if (["name", "city"].includes(sortKey)) {
        if (!sortType) return `Tipo de ordenação não informado`;
        if (!["asc", "desc"].includes(sortType)) return `Tipo de ordenação não compatível`;
      } else {
        return "Chave de ordenação inválida";
      }

      return true;
    },
  },
];