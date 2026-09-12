import { Router } from "express";
import UserController from "../controllers/User.controller.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CREATE_USER_RULES,
  EDIT_USER_RULES,
  FILTER_USERS_RULES,
} from "../validators/user.validator.js";
import requiresPermission from "../middlewares/permission.js";
import { pagination } from "../middlewares/validator/pagination.js";
import identifier from "../middlewares/validator/id.js";

const userRouter = Router();
const canAccessResource = requiresPermission.forResource("user");

userRouter.get(
  "/",
  canAccessResource.withAction("list"),
  pagination(FILTER_USERS_RULES),
  UserController.findAll,
);

userRouter.get(
  "/:id",
  canAccessResource.withAction("view"),
  identifier,
  UserController.findById,
);

userRouter.post(
  "/",
  canAccessResource.withAction("create"),
  validateRequest.body.withRules(CREATE_USER_RULES).middleware,
  UserController.create,
);

userRouter.patch(
  "/deactivate/:id",
  canAccessResource.withAction("delete"),
  identifier,
  UserController.deactivate,
);

userRouter.patch(
  "/activate/:id",
  canAccessResource.withAction("restore"),
  identifier,
  UserController.reactivate,
);

userRouter.patch(
  "/:id",
  canAccessResource.withAction("edit"),
  identifier,
  validateRequest.body.withRules(EDIT_USER_RULES).middleware,
  UserController.edit,
);

export default userRouter;
