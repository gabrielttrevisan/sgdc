import { Router } from "express";
import validator from "../middlewares/validator/validator.js";
import CityController from "../controllers/City.controller.js";
import {
  CREATE_CITY_RULES,
  EDIT_CITY_BODY_RULES,
  IDENTIFY_CITY_PARAM_RULES,
} from "../validators/city.validator.js";

const citiesRouter = Router();

citiesRouter.get("/", CityController.findAll);

citiesRouter.get(
  "/:id",
  validator({
    rules: IDENTIFY_CITY_PARAM_RULES,
    targetKey: "params",
  }),
  CityController.findById,
);

citiesRouter.delete(
  "/:id",
  validator({
    rules: IDENTIFY_CITY_PARAM_RULES,
    targetKey: "params",
  }),
  CityController.delete,
);

citiesRouter.post(
  "/",
  validator({ rules: CREATE_CITY_RULES, targetKey: "body" }),
  CityController.create,
);

citiesRouter.patch(
  "/:id",
  validator({ rules: IDENTIFY_CITY_PARAM_RULES, targetKey: "params" }),
  validator({ rules: EDIT_CITY_BODY_RULES, targetKey: "body" }),
  CityController.edit,
);

export default citiesRouter;
