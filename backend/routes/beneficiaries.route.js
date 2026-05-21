import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";

const beneficiariesRouter = Router();

beneficiariesRouter.get("/", BeneficiaryController.findAll);

export default beneficiariesRouter;
