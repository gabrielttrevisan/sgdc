import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";
import validator from "../middlewares/validator/validator.js";
import {
  CREATE_BENEFICIARY_RULES,
  EDIT_BENEFICIARY_BODY_RULES,
  EDIT_BENEFICIARY_PARAM_RULES,
} from "../validators/beneficiary.validator.js";

const beneficiariesRouter = Router();

beneficiariesRouter.get("/", BeneficiaryController.findAll);
beneficiariesRouter.get("/:id", BeneficiaryController.findById);
beneficiariesRouter.delete("/:id", BeneficiaryController.delete);

beneficiariesRouter.post(
  "/",
  validator({ rules: CREATE_BENEFICIARY_RULES, targetKey: "body" }),
  BeneficiaryController.create,
);

beneficiariesRouter.patch(
  "/:id",
  validator({ rules: EDIT_BENEFICIARY_PARAM_RULES, targetKey: "params" }),
  validator({ rules: EDIT_BENEFICIARY_BODY_RULES, targetKey: "body" }),
  BeneficiaryController.edit,
);

export default beneficiariesRouter;
