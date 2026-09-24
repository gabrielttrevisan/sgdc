/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_PRODUCT_RULES = [
  {
    property: "name",
    validate: (value) => {
      if (typeof value !== "string") return "Nome do produto inválido";

      const trimmed = value.trim();
      if (trimmed.length < 8 || trimmed.length > 120)
        return "O nome deve ter entre 8 e 120 caracteres";

      return true;
    },
  },
  {
    property: "description",
    required: false,
    validate: (value) =>
      value === null || (typeof value === "string" && value.length <= 140)
        ? true
        : "A descrição não pode ter mais que 140 caracteres",
  },
  {
    property: "measuringUnitId",
    validate: (value) =>
      Number.isInteger(value) && value > 0
        ? true
        : "Unidade de medida inválida",
  },
  {
    property: "needRefrigeration",
    validate: (value) =>
      typeof value === "boolean" ? true : "Valor de refrigeração inválido",
  },
  {
    property: "isPerishable",
    validate: (value) =>
      typeof value === "boolean" ? true : "Valor de perecibilidade inválido",
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EDIT_PRODUCT_BODY_RULES = CREATE_PRODUCT_RULES.map((rule) => ({
  ...rule,
  required: false,
}));

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_PRODUCT_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || value !== "name") return "Chave de ordenação inválida";
      if (!target.sortType) return "Tipo de ordenação não informado";
      if (!["asc", "desc"].includes(target.sortType))
        return "Tipo de ordenação não compatível com chave de ordenação";

      return true;
    },
  },
];
