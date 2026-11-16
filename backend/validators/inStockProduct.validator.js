/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_IN_STOCK_PRODUCT_RULES = [
  {
    property: "q",
    required: false,
    validate: (value) =>
      typeof value === "string" && value.trim().length > 0
        ? true
        : "Texto buscado inválido",
  },
];
