import APIResponse from "../lib/APIResponse.js";
import Product from "../models/Product.model.js";

export default class ProductController {
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, sortKey, sortType, page, perPage } = req.query;

    const [products, error] = await Product.findAll({
      query: q,
      sortKey,
      sortType,
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 10,
    });

    if (error) return response.internalError();
    if (products.items.length === 0)
      return response.notFound("Nenhum produto encontrado");

    return response.success(products);
  }

  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [product, error] = await Product.findById(parseInt(req.params.id));

    if (error) return response.internalError();
    if (!product) return response.notFound("Produto não encontrado");

    return response.success(product);
  }

  static async delete(req, res) {
    const response = APIResponse.from(res);
    const [isDeleted, error] = await Product.delete(req.params.id);

    if (error) return response.internalError();
    if (!isDeleted) return response.internalError("Falha ao remover produto");

    return response.success({ success: true });
  }

  static async restore(req, res) {
    const response = APIResponse.from(res);
    const [isRestored, error] = await Product.restore(req.params.id);

    if (error) return response.internalError();
    if (!isRestored) return response.internalError("Falha ao restaurar produto");

    return response.success({ success: true });
  }

  static async create(req, res) {
    const response = APIResponse.from(res);
    const [isCreated, error] = await Product.create(req.body);

    if (error) return response.internalError();
    if (!isCreated)
      return response.badRequest().withIssue("INSERT_FAILURE", "Falha ao cadastrar produto").send();

    return response.success({ success: true });
  }

  static async edit(req, res) {
    const response = APIResponse.from(res);
    const [isUpdated, error] = await Product.edit({
      id: req.params.id,
      ...req.body,
    });

    if (error) return response.internalError();
    if (!isUpdated)
      return response.badRequest().withIssue("UPDATE_FAILURE", "Falha ao alterar produto").send();

    return response.success({ success: true });
  }
}
