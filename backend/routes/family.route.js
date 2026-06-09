import { Router } from "express";
import { FamilyController } from "../controllers/Family.controller.js";
import identifier from "../middlewares/validator/id.js";

const familyRouter = Router();

familyRouter.get("/", FamilyController.findAll);
familyRouter.post("/", FamilyController.create);
familyRouter.patch("/:id", identifier, FamilyController.edit);
familyRouter.delete("/:id", identifier, FamilyController.delete);

export default familyRouter;
