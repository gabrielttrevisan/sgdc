import { PAGINATION_FILTER_RULES } from "../../validators/pagination.validator.js";
import validator from "./validator.js";

/**
 * @param {import("./validator").ValidationRule[]} [extension]
 * @returns
 */
export const pagination = (extension = []) =>
  validator({
    rules: [...PAGINATION_FILTER_RULES, ...extension],
    atLeastOneProp: false,
    targetKey: "query",
  });
