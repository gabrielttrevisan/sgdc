import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";
import validator from "../middlewares/validator.js";
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
  validator(CREATE_BENEFICIARY_RULES, "body"),
  BeneficiaryController.create,
);

beneficiariesRouter.patch(
  "/:id",
  validator(EDIT_BENEFICIARY_PARAM_RULES, "params"),
  validator(EDIT_BENEFICIARY_BODY_RULES, "body"),
  BeneficiaryController.edit,
);

export default beneficiariesRouter;
