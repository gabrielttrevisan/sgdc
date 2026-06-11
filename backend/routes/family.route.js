import { Router } from "express";
import { FamilyController } from "../controllers/Family.controller.js";
import identifier from "../middlewares/validator/id.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CREATE_OR_EDIT_FAMILY_RULES,
  FILTER_FAMILIES_RULES,
} from "../validators/family.validator.js";
import { pagination } from "../middlewares/validator/pagination.js";

const familyRouter = Router();

familyRouter.get(
  "/",
  pagination(FILTER_FAMILIES_RULES),
  FamilyController.findAll,
);

familyRouter.post(
  "/",
  validateRequest.body.withRules(CREATE_OR_EDIT_FAMILY_RULES).middleware,
  FamilyController.create,
);

familyRouter.put(
  "/:id",
  identifier,
  validateRequest.body.withRules(CREATE_OR_EDIT_FAMILY_RULES).middleware,
  FamilyController.edit,
);

familyRouter.delete("/:id", identifier, FamilyController.delete);

export default familyRouter;
