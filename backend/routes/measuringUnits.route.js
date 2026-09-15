import { Router } from "express";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CREATE_MEASURING_UNIT_RULES,
  EDIT_MEASURING_UNIT_BODY_RULES,
  FILTER_MEASURING_UNIT_RULES,
} from "../validators/measuringUnit.validator.js";
import MeasuringUnitController from "../controllers/MeasuringUnit.controller.js";
import requiresPermission from "../middlewares/permission.js";

const measuringUnitsRouter = Router();
const canAccessResource = requiresPermission.forResource("measuring_unit");

measuringUnitsRouter.get(
  "/",
  canAccessResource.withAction("list"),
  pagination(FILTER_MEASURING_UNIT_RULES),
  MeasuringUnitController.findAll,
);

measuringUnitsRouter.get(
  "/:id",
  canAccessResource.withAction("view"),
  identifier,
  MeasuringUnitController.findById,
);

measuringUnitsRouter.delete(
  "/:id",
  canAccessResource.withAction("delete"),
  identifier,
  MeasuringUnitController.delete,
);

measuringUnitsRouter.post(
  "/",
  canAccessResource.withAction("create"),
  validateRequest.body.withRules(CREATE_MEASURING_UNIT_RULES).middleware,
  MeasuringUnitController.create,
);

measuringUnitsRouter.patch(
  "/:id",
  canAccessResource.withAction("create"),
  identifier,
  validateRequest.body.withRules(EDIT_MEASURING_UNIT_BODY_RULES).middleware,
  MeasuringUnitController.edit,
);

export default measuringUnitsRouter;
