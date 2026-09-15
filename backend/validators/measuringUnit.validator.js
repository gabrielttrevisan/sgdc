/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_MEASURING_UNIT_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome da unidade inválido";

      if (typeof value !== "string") return message;

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 32)
        return "Nome não deve ser vazio ou ter mais que 32 caracteres";

      if (!trimmed.match(/^([-A-zÀ-ž\s]+)$/i)) return message;

      return true;
    },
  },
  {
    property: "symbol",
    validate: (value) => {
      if (typeof value !== "string") return "Símbolo/abreviação inválido";

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 8)
        return "Símbolo/abreviação não pode ser vazio ou conter mais que 8 caracteres";

      return true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_MEASURING_UNIT_BODY_RULES = CREATE_MEASURING_UNIT_RULES.map(
  (rule) => ({
    ...rule,
    required: false,
  }),
);

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_MEASURING_UNIT_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      const sortKey = value;

      if (sortKey === "name") {
        if (!sortType) {
          return `Tipo de ordenação não informado`;
        }

        if (!["asc", "desc"].includes(sortType))
          return `Tipo de ordenação não compatível com chave de ordenação`;
      } else {
        return "Chave de ordenação inválida";
      }

      return true;
    },
  },
];
