import { Router } from "express";
import AuthController from "../controllers/Auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-in", AuthController.signIn);

export default authRouter;
