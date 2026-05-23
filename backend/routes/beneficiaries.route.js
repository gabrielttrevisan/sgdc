import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";
import validator from "../middlewares/validator/validator.js";
import {
  CREATE_BENEFICIARY_RULES,
  EDIT_BENEFICIARY_BODY_RULES,
  FILTER_BENEFICIARIES_RULES,
} from "../validators/beneficiary.validator.js";
import { pagination } from "../middlewares/validator/pagination.js";
import identifier from "../middlewares/validator/id.js";

const beneficiariesRouter = Router();

beneficiariesRouter.get(
  "/",
  pagination(FILTER_BENEFICIARIES_RULES),
  BeneficiaryController.findAll,
);

beneficiariesRouter.get("/:id", identifier, BeneficiaryController.findById);

beneficiariesRouter.delete("/:id", identifier, BeneficiaryController.delete);

beneficiariesRouter.post(
  "/",
  validator({ rules: CREATE_BENEFICIARY_RULES, targetKey: "body" }),
  BeneficiaryController.create,
);

beneficiariesRouter.patch(
  "/:id",
  identifier,
  validator({ rules: EDIT_BENEFICIARY_BODY_RULES, targetKey: "body" }),
  BeneficiaryController.edit,
);

export default beneficiariesRouter;
