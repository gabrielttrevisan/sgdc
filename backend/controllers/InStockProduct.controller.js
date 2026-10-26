import APIResponse from "../lib/APIResponse.js";
import InStockProductModel from "../models/InStockProduct.model.js";

export default class InStockProductController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, page, perPage } = req.query;

    const [products, error] = await InStockProductModel.findAll({
      query: q,
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
    });

    if (error) return response.internalError();
    if (products.items.length === 0)
      return response.notFound("Nenhum produto em estoque encontrado");

    return response.success(products);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [product, error] = await InStockProductModel.findById(
      parseInt(req.params.id, 10),
    );

    if (error) return response.internalError();
    if (!product) return response.notFound("Produto em estoque não encontrado");

    return response.success(product);
  }
}
