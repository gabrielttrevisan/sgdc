import { Router } from "express";
import BeneficiaryController from "../controllers/Beneficiary.controller.js";
import validator from "../middlewares/validator.js";
import { CREATE_BENEFICIARY_RULES } from "../validators/beneficiary.validator.js";

const beneficiariesRouter = Router();

beneficiariesRouter.get("/", BeneficiaryController.findAll);
beneficiariesRouter.get("/:id", BeneficiaryController.findById);
beneficiariesRouter.delete("/:id", BeneficiaryController.delete);

beneficiariesRouter.post(
  "/",
  validator(CREATE_BENEFICIARY_RULES, "body"),
  BeneficiaryController.create,
);

export default beneficiariesRouter;
