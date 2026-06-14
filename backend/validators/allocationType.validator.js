/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_ALLOCATION_TYPE_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome de cidade inválido";

      if (typeof value !== "string") return message;

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 32)
        return "Nome não deve ser vazio ou ter mais que 32 caracteres";

      if (!trimmed.match(/^([-A-zÀ-ž0-9\s]+)$/i)) return message;

      return true;
    },
  },
  {
    property: "description",
    validate: (value) => {
      if (typeof value !== "string") return "Descrição inválida";

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 64)
        return "Descrição não pode ser vazia ou conter mais que 64 caracteres";

      return true;
    },
    required: false,
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_ALLOCATION_TYPE_BODY_RULES = CREATE_ALLOCATION_TYPE_RULES.map(
  (rule) => ({
    ...rule,
    required: false,
  }),
);

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_ALLOCATION_TYPE_RULES = [
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
