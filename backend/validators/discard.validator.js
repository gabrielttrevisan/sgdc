function isPositiveSafeInteger(value) {
  return (
    (Number.isSafeInteger(value) ||
      (typeof value === "string" && /^\d+$/.test(value))) &&
    Number.isSafeInteger(Number(value)) &&
    Number(value) > 0
  );
}

function isNullableDetails(value, maxLength) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.length <= maxLength)
  );
}

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_DISCARD_RULES = [
  {
    property: "details",
    validate(value) {
      if (typeof value !== "string") return "Detalhes do descarte inválidos";
      const length = value.trim().length;
      return length >= 8 && length <= 255
        ? true
        : "Os detalhes devem conter entre 8 e 255 caracteres";
    },
  },
  {
    property: "allocationId",
    required: false,
    validate: (value) =>
      value === null || isPositiveSafeInteger(value)
        ? true
        : "Alocação inválida",
  },
  {
    property: "products",
    validate(value) {
      if (!Array.isArray(value) || value.length === 0)
        return "Selecione ao menos um produto";

      return value.every(
        (product) =>
          product &&
          typeof product === "object" &&
          isPositiveSafeInteger(product.ispInRoomId) &&
          isPositiveSafeInteger(product.quantity) &&
          isNullableDetails(product.details, 128),
      )
        ? true
        : "Produtos do descarte inválidos";
    },
  },
  {
    property: "volunteers",
    validate(value) {
      if (!Array.isArray(value)) return "Lista de voluntários inválida";

      return value.every(
        (volunteer) =>
          volunteer &&
          typeof volunteer === "object" &&
          isPositiveSafeInteger(volunteer.id) &&
          isNullableDetails(volunteer.details, 128),
      )
        ? true
        : "Voluntários do descarte inválidos";
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_DISCARDS_RULES = [
  {
    property: "q",
    required: false,
    validate: (value) =>
      typeof value === "string" && value.trim().length > 0
        ? true
        : "Texto buscado inválido",
  },
];
