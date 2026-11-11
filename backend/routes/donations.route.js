import { Router } from "express";
import DonationController from "../controllers/Donation.controller.js";
import requiresPermission from "../middlewares/permission.js";
import identifier from "../middlewares/validator/id.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import { CREATE_DONATION_RULES } from "../validators/donation.validator.js";

const donationsRouter = Router();
const canManageDonations = requiresPermission.forResource("donation");

donationsRouter.get(
  "/context/:id",
  canManageDonations.withAction("create"),
  identifier,
  DonationController.getBeneficiaryContext,
);

donationsRouter.post(
  "/",
  canManageDonations.withAction("create"),
  validateRequest.body.withRules(CREATE_DONATION_RULES).middleware,
  DonationController.create,
);

donationsRouter.delete(
  "/:id",
  canManageDonations.withAction("delete"),
  identifier,
  DonationController.cancel,
);

export default donationsRouter;
