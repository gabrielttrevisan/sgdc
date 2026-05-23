import { Router } from "express";
import validator from "../middlewares/validator/validator.js";
import CityController from "../controllers/City.controller.js";
import {
  CREATE_CITY_RULES,
  EDIT_CITY_BODY_RULES,
  FILTER_CITIES_RULES,
} from "../validators/city.validator.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";

const citiesRouter = Router();

citiesRouter.get("/", pagination(FILTER_CITIES_RULES), CityController.findAll);

citiesRouter.get("/:id", identifier, CityController.findById);

citiesRouter.delete("/:id", identifier, CityController.delete);

citiesRouter.post(
  "/",
  validator({ rules: CREATE_CITY_RULES, targetKey: "body" }),
  CityController.create,
);

citiesRouter.patch(
  "/:id",
  identifier,
  validator({ rules: EDIT_CITY_BODY_RULES, targetKey: "body" }),
  CityController.edit,
);

export default citiesRouter;
