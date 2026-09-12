import { Router } from "express";
import { pagination } from "../middlewares/validator/pagination.js";
import { RoleController } from "../controllers/Role.controller.js";
import requiresPermission from "../middlewares/permission.js";
import { FILTER_ROLES_RULES } from "../validators/role.validator.js";

const rolesRouter = Router();
const hasPermission = requiresPermission.forResource("role");

rolesRouter.get(
  "/",
  hasPermission.withAction("list"),
  pagination(FILTER_ROLES_RULES),
  RoleController.findAll,
);

export default rolesRouter;
