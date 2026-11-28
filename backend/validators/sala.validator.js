/** @type {import("../middlewares/validator/validator.js").ValidationRule[]} */

export const CREATE_SALA_RULES = [

  {
    property: "nome",

    validate: (value) => {

      if (
        typeof value !== "string" ||
        value.trim().length < 3
      ) {
        return "Nome inválido";
      }

      return true;
    },
  },

  {
    property: "descricao",

    required: false,

    validate: () => true,
  },

];

export const EDIT_SALA_BODY_RULES =
  CREATE_SALA_RULES.map(
    (rule) => ({
      ...rule,
      required:false
    })
  );

export const FILTER_SALA_RULES = [
  {
    property: "sortKey",
    required: false,
    validate: (value, target) => {
      if (!value || typeof value !== "string" || value.trim().length === 0)
        return "Chave de ordenação inválida";

      if (value !== "nome") return "Chave de ordenação inválida";

      if (!["asc", "desc"].includes(target.sortType))
        return "Tipo de ordenação não compatível com chave de ordenação";

      return true;
    },
  },
];