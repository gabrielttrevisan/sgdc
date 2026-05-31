import { Router } from "express";

import SalaController
from "../controllers/Sala.controller.js";

import validator
from "../middlewares/validator/validator.js";

import identifier
from "../middlewares/validator/id.js";

import {
  CREATE_SALA_RULES,
  EDIT_SALA_RULES
}
from "../validators/sala.validator.js";

const salasRouter = Router();

salasRouter.get(
  "/",
  SalaController.findAll
);

salasRouter.get(
  "/:id",
  identifier,
  SalaController.findById
);

salasRouter.post(
  "/",
  validator({
    rules:CREATE_SALA_RULES,
    targetKey:"body"
  }),
  SalaController.create
);

salasRouter.put(
  "/:id",
  identifier,

  validator({
    rules:EDIT_SALA_RULES,
    targetKey:"body"
  }),

  SalaController.edit
);

salasRouter.delete(
  "/:id",
  identifier,
  SalaController.delete
);

export default salasRouter;