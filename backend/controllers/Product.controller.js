import APIResponse from "../lib/APIResponse.js";
import Product from "../models/Product.model.js";

class ProductController {
  static async index(req, res) {
    const response = APIResponse.from(res);

    try {
      const { name } = req.query;

      const products = await Product.findAll(name);

      return response.success(products);
    } catch (error) {
      return response.internalError(error?.message || "Erro ao listar produtos");
    }
  }

  static async store(req, res) {
    const response = APIResponse.from(res);

    try {
      const result = await Product.create(req.body);

      return response.success({ success: true, id: result.insertId }, 201);
    } catch (error) {
      return response.internalError(error?.message || "Erro ao cadastrar produto");
    }
  }

  static async update(req, res) {
    const response = APIResponse.from(res);

    try {
      const { id } = req.params;

      await Product.update(id, req.body);

      return response.success({ success: true });
    } catch (error) {
      return response.internalError(error?.message || "Erro ao atualizar produto");
    }
  }

  static async delete(req, res) {
    const response = APIResponse.from(res);

    try {
      const { id } = req.params;

      await Product.delete(id);

      return response.success({ success: true });
    } catch (error) {
      return response.internalError(error?.message || "Erro ao remover produto");
    }
  }
}

export default ProductController;
