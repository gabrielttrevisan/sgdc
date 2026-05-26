import { Router } from "express";
import validator from "../middlewares/validator/validator.js";
import VolunteerController from "../controllers/Volunteer.controller.js";
import {
  CREATE_VOLUNTEER_RULES,
  EDIT_VOLUNTEER_BODY_RULES,
  FILTER_VOLUNTEERS_RULES,
} from "../validators/volunteer.validator.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";

const volunteersRouter = Router();

volunteersRouter.get("/", pagination(FILTER_VOLUNTEERS_RULES), VolunteerController.findAll);

volunteersRouter.get("/:id", identifier, VolunteerController.findById);

volunteersRouter.delete("/:id", identifier, VolunteerController.delete);

volunteersRouter.post(
  "/",
  validator({ rules: CREATE_VOLUNTEER_RULES, targetKey: "body" }),
  VolunteerController.create,
);

volunteersRouter.patch(
  "/:id",
  identifier,
  validator({ rules: EDIT_VOLUNTEER_BODY_RULES, targetKey: "body" }),
  VolunteerController.edit,
);

export default volunteersRouter;