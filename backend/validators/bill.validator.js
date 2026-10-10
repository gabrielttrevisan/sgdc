/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CREATE_BILL_RULES = [
  {
    property: "dueDate",
    validate: (value) => {
      if (typeof value !== "string") return "Data de vencimento inválida";

      const rawDate = Date.parse(value);

      if (isNaN(rawDate) || rawDate <= Date.now())
        return "Data de vencimento inválida. Mal formatada ou inferior a agora";

      return true;
    },
  },
  {
    property: "value",
    validate: (value) => {
      if (typeof value !== "number") return "Valor inválido";

      const parsed = parseFloat(value);

      if (isNaN(parsed) || parsed <= 0.1)
        return "Valor inválido. Deve ser numérico e maior que 0.1";

      return true;
    },
  },
  {
    property: "description",
    validate: (value) => {
      if (typeof value !== "string") return "Descrição inválida";

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 256)
        return "Descrição não pode ser vazia ou conter mais que 256 caracteres";

      return true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const FILTER_BILLS_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      const sortType = target.sortType;

      const sortKey = value;

      if (["descr", "due-date"].includes(sortKey)) {
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

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const EXTEND_BILL_RULES = [
  {
    property: "newDueDate",
    validate: (value) => {
      if (typeof value !== "string") return "Nova data de vencimento inválida";

      const rawDate = Date.parse(value);

      if (isNaN(rawDate) || rawDate <= Date.now())
        return "Nova data de vencimento inválida: mal formatada ou inferior a agora";

      return true;
    },
  },
  {
    property: "details",
    validate: (value) => {
      if (typeof value !== "string") return "Motivo inválida";

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 256)
        return "Motivo não pode ser vazio ou conter mais que 256 caracteres";

      return true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CANCEL_BILL_RULES = [
  {
    property: "details",
    validate: (value) => {
      if (typeof value !== "string") return "Motivo inválida";

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 256)
        return "Motivo não pode ser vazio ou conter mais que 256 caracteres";

      return true;
    },
  },
];

/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const CANCEL_AND_COPY_BILL_RULES = [
  ...CREATE_BILL_RULES,
  {
    property: "cancelationDetails",
    validate: (value) => {
      if (typeof value !== "string") return "Motivo inválida";

      const trimmed = value.trim();

      if (trimmed.length === 0 || trimmed.length > 256)
        return "Motivo não pode ser vazio ou conter mais que 256 caracteres";

      return true;
    },
  },
];
