import { Router } from "express";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import requiresPermission from "../middlewares/permission.js";
import AllocationController from "../controllers/Allocation.controller.js";
import {
  CREATE_ALLOCATION_RULES,
  EDIT_ALLOCATION_BODY_RULES,
  FILTER_ALLOCATIONS_RULES,
} from "../validators/allocation.validator.js";

const allocationsRouter = Router();
const canAccessResource = requiresPermission.forResource("volunteer");

allocationsRouter.get(
  "/",
  canAccessResource.withAction("list"),
  pagination(FILTER_ALLOCATIONS_RULES),
  AllocationController.findAll,
);

allocationsRouter.get(
  "/volunteer/:id",
  canAccessResource.withAction("list"),
  identifier,
  AllocationController.findCurrentByVolunteer,
);

allocationsRouter.get(
  "/:id",
  canAccessResource.withAction("view"),
  identifier,
  AllocationController.findById,
);

allocationsRouter.post(
  "/",
  canAccessResource.withAction("create"),
  validateRequest.body.withRules(CREATE_ALLOCATION_RULES).middleware,
  AllocationController.create,
);

allocationsRouter.patch(
  "/:id",
  canAccessResource.withAction("edit"),
  identifier,
  validateRequest.body.withRules(EDIT_ALLOCATION_BODY_RULES).middleware,
  AllocationController.edit,
);

allocationsRouter.delete(
  "/:id",
  canAccessResource.withAction("delete"),
  identifier,
  AllocationController.delete,
);

export default allocationsRouter;
