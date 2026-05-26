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
    validate: (value) => {
      if (!value || typeof value !== "string") return "CPF ou RG não fornecido";
      const clean = value.replace(/\D/g, "");
      if (clean.length < 7 || clean.length > 11 || clean.length === 10) {
        return "CPF ou RG inválido";
      }
      return true;
    }
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
    required: false,
    validate: (value) => {
      if (!value) return true; // Se vier vazio, deixa passar!
      if (typeof value !== "string" || value.trim().length === 0) return "Rua inválida";
      return true;
    },
  },
  {
    property: "number",
    required: false,
    validate: (value) => {
      if (!value) return true;
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
    required: false,
    validate: (value) => {
      if (!value) return true;
      if (typeof value !== "string" || value.trim().length === 0) return "Bairro inválido";
      return true;
    },
  },
  {
    property: "city",
    required: false,
    validate: (value) => {
      if (!value) return true;
      if (typeof value !== "string" || value.trim().length === 0) return "Cidade inválida";
      return true;
    },
  },
  {
    property: "state",
    required: false,
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