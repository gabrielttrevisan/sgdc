import { Router } from "express";
import { FamilyController } from "../controllers/Family.controller.js";

const familyRouter = Router();

familyRouter.post("/", FamilyController.create);

export default familyRouter;
