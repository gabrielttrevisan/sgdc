import { Router } from "express";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import requiresPermission from "../middlewares/permission.js";
import ProductController from "../controllers/Product.controller.js";
import {
	CREATE_PRODUCT_RULES,
	EDIT_PRODUCT_BODY_RULES,
	FILTER_PRODUCT_RULES,
} from "../validators/product.validator.js";

const productRouter = Router();
const canAccessResource = requiresPermission.forResource("product");

productRouter.get(
	"/",
	canAccessResource.withAction("list"),
	pagination(FILTER_PRODUCT_RULES),
	ProductController.findAll,
);

productRouter.get(
	"/:id",
	canAccessResource.withAction("view"),
	identifier,
	ProductController.findById,
);

productRouter.delete(
	"/:id",
	canAccessResource.withAction("delete"),
	identifier,
	ProductController.delete,
);

productRouter.post(
	"/",
	canAccessResource.withAction("create"),
	validateRequest.body.withRules(CREATE_PRODUCT_RULES).middleware,
	ProductController.create,
);

productRouter.patch(
	"/:id",
	canAccessResource.withAction("edit"),
	identifier,
	validateRequest.body.withRules(EDIT_PRODUCT_BODY_RULES).middleware,
	ProductController.edit,
);

productRouter.put(
	"/:id",
	canAccessResource.withAction("edit"),
	identifier,
	validateRequest.body.withRules(EDIT_PRODUCT_BODY_RULES).middleware,
	ProductController.edit,
);

productRouter.post(
	"/:id/restore",
	canAccessResource.withAction("restore"),
	identifier,
	ProductController.restore,
);

export default productRouter;
