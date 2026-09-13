import { Router } from "express";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import { RoleController } from "../controllers/Role.controller.js";
import requiresPermission from "../middlewares/permission.js";
import {
  CREATE_ROLE_RULES,
  FILTER_ROLES_RULES,
} from "../validators/role.validator.js";

const rolesRouter = Router();
const hasPermission = requiresPermission.forResource("role");

rolesRouter.post(
  "/",
  hasPermission.withAction("create"),
  validateRequest.body.withRules(CREATE_ROLE_RULES).middleware,
  RoleController.create,
);

rolesRouter.get(
  "/",
  hasPermission.withAction("list"),
  pagination(FILTER_ROLES_RULES),
  RoleController.findAll,
);

export default rolesRouter;
