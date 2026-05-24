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

const allocationTypesRouter = Router();

allocationTypesRouter.get(
  "/",
  pagination(FILTER_ALLOCATION_TYPE_RULES),
  AllocationTypeController.findAll,
);

allocationTypesRouter.delete(
  "/:id",
  identifier,
  AllocationTypeController.delete,
);

allocationTypesRouter.post(
  "/",
  validateRequest.body.withRules(CREATE_ALLOCATION_TYPE_RULES).middleware,
  AllocationTypeController.create,
);

allocationTypesRouter.patch(
  "/:id",
  identifier,
  validateRequest.body.withRules(EDIT_ALLOCATION_TYPE_BODY_RULES).middleware,
  AllocationTypeController.edit,
);

export default allocationTypesRouter;
