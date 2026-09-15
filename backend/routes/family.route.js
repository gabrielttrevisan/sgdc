import { Router } from "express";
import { FamilyController } from "../controllers/Family.controller.js";
import identifier from "../middlewares/validator/id.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CREATE_OR_EDIT_FAMILY_RULES,
  FILTER_FAMILIES_RULES,
} from "../validators/family.validator.js";
import { pagination } from "../middlewares/validator/pagination.js";
import requiresPermission from "../middlewares/permission.js";

const familyRouter = Router();
const canAccessResource = requiresPermission.forResource("family");

familyRouter.get(
  "/",
  canAccessResource.withAction("list"),
  pagination(FILTER_FAMILIES_RULES),
  FamilyController.findAll,
);

familyRouter.post(
  "/",
  canAccessResource.withAction("create"),
  validateRequest.body.withRules(CREATE_OR_EDIT_FAMILY_RULES).middleware,
  FamilyController.create,
);

familyRouter.put(
  "/:id",
  canAccessResource.withAction("edit"),
  identifier,
  validateRequest.body.withRules(CREATE_OR_EDIT_FAMILY_RULES).middleware,
  FamilyController.edit,
);

familyRouter.delete(
  "/:id",
  canAccessResource.withAction("delete"),
  identifier,
  FamilyController.delete,
);

export default familyRouter;
