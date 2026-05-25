import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";
import { validateRequest } from "../middlewares/validator/validator.js";
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
  validateRequest.body.withRules(CREATE_BENEFICIARY_RULES).middleware,
  BeneficiaryController.create,
);

beneficiariesRouter.patch(
  "/:id",
  identifier,
  validateRequest.body.withRules(EDIT_BENEFICIARY_BODY_RULES).middleware,
  BeneficiaryController.edit,
);

export default beneficiariesRouter;
