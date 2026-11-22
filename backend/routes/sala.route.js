import { Router } from "express";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import SalaController from "../controllers/sala.controller.js";
import {
  CREATE_SALA_RULES,
  EDIT_SALA_BODY_RULES,
  FILTER_SALA_RULES,
} from "../validators/sala.validator.js";
import requiresPermission from "../middlewares/permission.js";

const salasRouter = Router();
const canAccessResource = requiresPermission.forResource("sala");

salasRouter.get(
  "/",
  canAccessResource.withAction("list"),
  pagination(FILTER_SALA_RULES),
  SalaController.findAll,
);

salasRouter.get(
  "/:id",
  canAccessResource.withAction("view"),
  identifier,
  SalaController.findById,
);

salasRouter.post(
  "/",
  canAccessResource.withAction("create"),
  validateRequest.body.withRules(CREATE_SALA_RULES).middleware,
  SalaController.create,
);

salasRouter.patch(
  "/:id",
  canAccessResource.withAction("edit"),
  identifier,
  validateRequest.body.withRules(EDIT_SALA_BODY_RULES).middleware,
  SalaController.edit,
);

salasRouter.delete(
  "/:id",
  canAccessResource.withAction("delete"),
  identifier,
  SalaController.delete,
);

export default salasRouter;