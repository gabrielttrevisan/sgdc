import { Router } from "express";
import requiresPermission from "../middlewares/permission.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import SessionController from "../controllers/Session.controller.js";
import { CREATE_SESSION_RULES } from "../validators/session.validator.js";

const sessionsRouter = Router();
const canAccessFamily = requiresPermission.forResource("family");

sessionsRouter.post(
  "/",
  canAccessFamily.withAction("session"),
  validateRequest.body.withRules(CREATE_SESSION_RULES).middleware,
  SessionController.create,
);

export default sessionsRouter;
