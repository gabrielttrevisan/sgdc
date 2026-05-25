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

const measuringUnitsRouter = Router();

measuringUnitsRouter.get(
  "/",
  pagination(FILTER_MEASURING_UNIT_RULES),
  MeasuringUnitController.findAll,
);

measuringUnitsRouter.delete("/:id", identifier, MeasuringUnitController.delete);

measuringUnitsRouter.post(
  "/",
  validateRequest.body.withRules(CREATE_MEASURING_UNIT_RULES).middleware,
  MeasuringUnitController.create,
);

measuringUnitsRouter.patch(
  "/:id",
  identifier,
  validateRequest.body.withRules(EDIT_MEASURING_UNIT_BODY_RULES).middleware,
  MeasuringUnitController.edit,
);

export default measuringUnitsRouter;
