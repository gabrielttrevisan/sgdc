import CachedAPIClient from "../lib/client/CachedAPIClient";
import { Service } from "./Service";

class ProductsService extends Service {
  #client = new CachedAPIClient();

  /** @param {import("../global").PaginatedQuery} query */
  async list({ query, ...rest } = { page: 1, perPage: 10 }) {
    try {
      const response = await this.#client.get("products", {
        q: query,
        ...rest,
      });

      if (response.data) {
        response.data.items = response.data.items.map(this.#mapFromBackend);
      }

      return response;
    } catch {
      return this.internal("Erro ao carregar produtos");
    }
  }

  async getById(id) {
    try {
      const response = await this.#client.get(`products/${id}`);
      return response.data
        ? { ...response, data: this.#mapFromBackend(response.data) }
        : response;
    } catch {
      return this.internal("Erro ao carregar produto");
    }
  }

  async create({
    name,
    description,
    measuringUnitId,
    needRefrigeration,
    isPerishable,
  }) {
    try {
      return await this.#client.post("products", {
        name,
        description: description ?? "",
        measuringUnitId: Number(measuringUnitId),
        needRefrigeration: Boolean(needRefrigeration),
        isPerishable: Boolean(isPerishable),
      });
    } catch {
      return this.internal("Erro ao cadastrar produto");
    }
  }

  async edit({
    id,
    name,
    description,
    measuringUnitId,
    needRefrigeration,
    isPerishable,
  }) {
    try {
      return await this.#client.patch(`products/${id}`, {
        name,
        description,
        measuringUnitId: Number(measuringUnitId),
        needRefrigeration: Boolean(needRefrigeration),
        isPerishable: Boolean(isPerishable),
      });
    } catch {
      return this.internal("Erro ao atualizar produto");
    }
  }

  async delete(id) {
    try {
      return await this.#client.delete(`products/${id}`);
    } catch {
      return this.internal("Erro ao remover produto");
    }
  }

  #mapFromBackend(product) {
    return {
      ...product,
      measuringUnitId: product.measuringUnit?.id,
      measuringUnitName: product.measuringUnit?.name,
      measuringUnitSymbol: product.measuringUnit?.symbol,
    };
  }
}

/**
 * @typedef {Object} Product
 * @prop {number} id
 * @prop {string} name
 * @prop {string} description
 * @prop {number} measuringUnitId
 * @prop {string} measuringUnitName
 * @prop {string} measuringUnitSymbol
 * @prop {boolean} needRefrigeration
 * @prop {boolean} isPerishable
 */

export default new ProductsService();
