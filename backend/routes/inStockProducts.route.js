import { Router } from "express";
import requiresPermission from "../middlewares/permission.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import InStockProductController from "../controllers/InStockProduct.controller.js";
import { FILTER_IN_STOCK_PRODUCT_RULES } from "../validators/inStockProduct.validator.js";

const inStockProductsRouter = Router();
const canAccessProducts = requiresPermission.forResource("product");

inStockProductsRouter.get(
  "/",
  canAccessProducts.withAction("list"),
  pagination(FILTER_IN_STOCK_PRODUCT_RULES),
  InStockProductController.findAll,
);

inStockProductsRouter.get(
  "/:id",
  canAccessProducts.withAction("view"),
  identifier,
  InStockProductController.findById,
);

export default inStockProductsRouter;
