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

/** @type {import("../middlewares/validator").ValidationRule[]} */
export const IDENTIFY_CITY_PARAM_RULES = [
  {
    property: "id",
    validator: "numericId",
    validatorErrorMessage: "Identificador não fornecido ou inválido",
  },
];

/** @type {import("../middlewares/validator").ValidationRule[]} */
export const EDIT_CITY_BODY_RULES = CREATE_CITY_RULES.map((rule) => ({
  ...rule,
  required: false,
}));
