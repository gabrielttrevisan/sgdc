import { Router } from "express";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import AllocationTypeController from "../controllers/AllocationType.controller.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CREATE_ALLOCATION_TYPE_RULES,
  EDIT_ALLOCATION_TYPE_BODY_RULES,
  FILTER_ALLOCATION_TYPE_RULES,
} from "../validators/allocationType.validator.js";
import requiresPermission from "../middlewares/permission.js";

const allocationTypesRouter = Router();
const canAccessResource = requiresPermission.forResource("allocation_type");

allocationTypesRouter.get(
  "/",
  canAccessResource.withAction("list"),
  pagination(FILTER_ALLOCATION_TYPE_RULES),
  AllocationTypeController.findAll,
);

allocationTypesRouter.delete(
  "/:id",
  canAccessResource.withAction("delete"),
  identifier,
  AllocationTypeController.delete,
);

allocationTypesRouter.post(
  "/",
  canAccessResource.withAction("create"),
  validateRequest.body.withRules(CREATE_ALLOCATION_TYPE_RULES).middleware,
  AllocationTypeController.create,
);

allocationTypesRouter.patch(
  "/:id",
  canAccessResource.withAction("edit"),
  identifier,
  validateRequest.body.withRules(EDIT_ALLOCATION_TYPE_BODY_RULES).middleware,
  AllocationTypeController.edit,
);

export default allocationTypesRouter;
