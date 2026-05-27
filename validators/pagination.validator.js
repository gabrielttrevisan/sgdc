/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */
export const PAGINATION_FILTER_RULES = [
  {
    property: "page",
    validate: (value) => {
      const message = "Página inválida";

      if (typeof value === "string") {
        if (value.trim().length === 0) return message;

        const parsedPage = parseInt(value);

        if (isNaN(parsedPage) || parsedPage < 1) return message;
      } else if (typeof value === "number") {
        if (isNaN(value) || value < 1) return message;
      } else return message;

      return true;
    },
    required: false,
  },
  {
    property: "perPage",
    validate: (value) => {
      const message = "Quantidade paginada inadequada";
      const min = 10;
      const max = 40;

      if (typeof value === "string") {
        if (value.trim().length === 0) return message;

        const parsedPerPage = parseInt(value);

        if (isNaN(parsedPerPage) || parsedPerPage < min || parsedPerPage > max)
          return message;
      } else if (typeof value === "number") {
        if (isNaN(value) || value < min || value > max) return message;
      } else return message;

      return true;
    },
    required: false,
  },
  {
    property: "q",
    validate: (value) => {
      const message = "Texto buscado inválido";

      if (!value || typeof value !== "string" || value.trim().length === 0)
        return message;

      return true;
    },
    required: false,
  },
];
