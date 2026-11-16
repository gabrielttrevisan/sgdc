import { Router } from "express";
import GoalController from "../controllers/Goal.controller.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import requiresPermission from "../middlewares/permission.js";
import { CREATE_GOAL_RULES } from "../validators/goal.validator.js";

const goalsRouter = Router();
const canManageGoals = requiresPermission.forResource("product");

goalsRouter.get(
  "/",
  canManageGoals.withAction("list"),
  pagination(),
  GoalController.findAll,
);

goalsRouter.get(
  "/:id",
  canManageGoals.withAction("view"),
  identifier,
  GoalController.findById,
);

goalsRouter.post(
  "/",
  canManageGoals.withAction("create"),
  validateRequest.body.withRules(CREATE_GOAL_RULES).middleware,
  GoalController.create,
);

export default goalsRouter;
