import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";

const beneficiariesRouter = Router();

beneficiariesRouter.get("/", BeneficiaryController.findAll);
beneficiariesRouter.get("/:id", BeneficiaryController.findById);

export default beneficiariesRouter;
