import express from "express";

const router = express.Router();

import ProductController from "../controllers/Product.controller.js";

import validateProduct from "../validators/product.validator.js";

router.get("/", ProductController.index);

router.post("/", validateProduct, ProductController.store);

router.put("/:id", validateProduct, ProductController.update);
router.patch("/:id", validateProduct, ProductController.update);

router.delete("/:id", ProductController.delete);

export default router;
