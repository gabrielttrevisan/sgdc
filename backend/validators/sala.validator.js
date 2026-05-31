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
    property: "capacidade",

    validate: (value) => {

      if (
        typeof value !== "number" ||
        value <= 0
      ) {
        return "Capacidade inválida";
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

export const EDIT_SALA_RULES =
  CREATE_SALA_RULES.map(
    (rule) => ({
      ...rule,
      required:false
    })
  );

export const FILTER_SALA_RULES = [];