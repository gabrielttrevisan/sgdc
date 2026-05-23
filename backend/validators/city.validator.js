/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_CITY_RULES = [
  {
    property: "name",
    validate: (value) => {
      const message = "Nome de cidade inválido";

      if (typeof value !== "string") return message;

      const trimmed = value.trim();

      if (trimmed.length === 0 || !trimmed.match(/^([-A-zÀ-ž\s]+)$/i))
        return message;

      return true;
    },
  },
  {
    property: "state",
    validator: "state",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_CITY_BODY_RULES = CREATE_CITY_RULES.map((rule) => ({
  ...rule,
  required: false,
}));

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_CITIES_RULES = [
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
