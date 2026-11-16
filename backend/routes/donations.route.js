import { Router } from "express";
import DonationController from "../controllers/Donation.controller.js";
import requiresPermission from "../middlewares/permission.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CANCEL_DONATION_RULES,
  CREATE_DONATION_RULES,
} from "../validators/donation.validator.js";

const donationsRouter = Router();
const canManageDonations = requiresPermission.forResource("donation");

donationsRouter.get(
  "/",
  canManageDonations.withAction("list"),
  pagination(),
  DonationController.findAll,
);

donationsRouter.get(
  "/context/:id",
  canManageDonations.withAction("create"),
  identifier,
  DonationController.getBeneficiaryContext,
);

donationsRouter.get(
  "/:id",
  canManageDonations.withAction("view"),
  identifier,
  DonationController.findById,
);

donationsRouter.post(
  "/",
  canManageDonations.withAction("create"),
  validateRequest.body.withRules(CREATE_DONATION_RULES).middleware,
  DonationController.create,
);

export default donationsRouter;
