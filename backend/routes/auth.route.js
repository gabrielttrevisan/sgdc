import { Router } from "express";
import { validateRequest } from "../middlewares/validator/validator.js";
import AuthController from "../controllers/Auth.controller.js";
import {
  RECOVERY_TOKEN_RULES,
  RESET_PASSWORD_RULES,
  SIGN_IN_RULES,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post(
  "/sign-in",
  validateRequest.body.withRules(SIGN_IN_RULES).middleware,
  AuthController.signIn,
);

authRouter.post(
  "/recovery-token",
  validateRequest.body.withRules(RECOVERY_TOKEN_RULES).middleware,
  AuthController.generateRecoveryToken,
);

authRouter.post(
  "/reset-password",
  validateRequest.body.withRules(RESET_PASSWORD_RULES).middleware,
  AuthController.resetPassword,
);

export default authRouter;
