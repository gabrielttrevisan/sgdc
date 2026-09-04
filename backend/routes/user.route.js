import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import { CREATE_USER_RULES } from "../validators/user.validator.js";

const userRouter = Router();

userRouter.post(
  "/",
  validateRequest.body.withRules(CREATE_USER_RULES).middleware,
  UserController.create,
);

export default userRouter;
