import APIClient from "../lib/services/APIClient";

/**
 * @typedef {Object} ProductPayload
 * @prop {number} [id]
 * @prop {string} nome
 * @prop {string} unidade
 * @prop {boolean} perecivel
 * @prop {boolean} refrigeracao
 * @prop {string} descricao
 */

const mapToBackend = ({ nome, unidade, perecivel, refrigeracao, descricao }) => ({
  name: nome,
  description: descricao ?? "",
  price: refrigeracao ? 1 : 0,
  stock: perecivel ? 1 : 0,
  status: unidade || "ACTIVE",
});

const mapFromBackend = (row) => ({
  id: row.ID ?? row.id,
  nome: row.NAME ?? row.name,
  unidade: row.STATUS ?? row.status ?? "",
  perecivel: Boolean(row.STOCK ?? row.stock),
  refrigeracao: Boolean(row.PRICE ?? row.price),
  descricao: row.DESCRIPTION ?? row.description ?? "",
});

class ProductsService {
  #client = new APIClient();

  async list() {
    try {
      const response = await this.#client.get("products");

      if (response.error) {
        return response;
      }

      return {
        ...response,
        data: response.data.map(mapFromBackend),
      };
    } catch {
      return {
        data: null,
        error: {
          code: 500,
          message: "Erro ao carregar produtos",
          issues: [],
        },
      };
    }
  }

  async create(product) {
    try {
      return await this.#client.post("products", mapToBackend(product));
    } catch {
      return {
        data: null,
        error: {
          code: 500,
          message: "Erro ao cadastrar produto",
          issues: [],
        },
      };
    }
  }

  async edit(product) {
    try {
      return await this.#client.put(`products/${product.id}`, mapToBackend(product));
    } catch {
      return {
        data: null,
        error: {
          code: 500,
          message: "Erro ao atualizar produto",
          issues: [],
        },
      };
    }
  }

  async delete(id) {
    try {
      return await this.#client.delete(`products/${id}`);
    } catch {
      return {
        data: null,
        error: {
          code: 500,
          message: "Erro ao remover produto",
          issues: [],
        },
      };
    }
  }
}

export default new ProductsService();
