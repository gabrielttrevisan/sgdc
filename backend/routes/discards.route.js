import { Router } from "express";
import requiresPermission from "../middlewares/permission.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import DiscardController from "../controllers/Discard.controller.js";
import {
  CREATE_DISCARD_RULES,
  FILTER_DISCARDS_RULES,
} from "../validators/discard.validator.js";

const discardsRouter = Router();
const canManageDiscards = requiresPermission.forResource("discard");

discardsRouter.get(
  "/",
  canManageDiscards.withAction("list"),
  pagination(FILTER_DISCARDS_RULES),
  DiscardController.findAll,
);

discardsRouter.post(
  "/",
  canManageDiscards.withAction("create"),
  validateRequest.body.withRules(CREATE_DISCARD_RULES).middleware,
  DiscardController.create,
);

discardsRouter.get(
  "/:id",
  canManageDiscards.withAction("view"),
  identifier,
  DiscardController.findById,
);

export default discardsRouter;
