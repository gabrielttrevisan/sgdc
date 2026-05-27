import { IDENTIFY_PARAM_RULES } from "../../validators/common.validator.js";
import validator from "./validator.js";

const identifier = validator({
  rules: IDENTIFY_PARAM_RULES,
  targetKey: "params",
});

export default identifier;
