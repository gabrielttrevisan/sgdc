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

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_EXPIRING_PRODUCTS_REPORT_RULES = [
  {
    property: "days",
    required: false,
    validate: (value) =>
      typeof value === "string" &&
      /^\d+$/.test(value) &&
      Number.isSafeInteger(Number(value))
        ? true
        : "A quantidade de dias deve ser um número inteiro maior ou igual a zero",
  },
  {
    property: "format",
    required: false,
    validate: (value) =>
      value === "csv" || value === "xls"
        ? true
        : "Formato de exportação inválido",
  },
];
