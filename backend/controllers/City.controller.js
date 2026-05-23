import APIResponse from "../lib/APIResponse.js";
import CityModel from "../models/City.model.js";

export default class CityController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/City.model.js").FindAllCitiesFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;

    if (sortKey) {
      if (sortKey === "name") {
        if (!sortType) {
          return response
            .badRequest()
            .withIssue("SORT_TYPE_MISSING", `Tipo de ordenação não informado`)
            .send();
        }

        if (!["asc", "desc"].includes(sortType))
          return response
            .badRequest()
            .withIssue(
              "SORT_TYPE_INVALID",
              `Tipo de ordenação não compatível com chave de ordenação`,
            )
            .send();

        filter.sortKey = sortKey;
        filter.sortType = sortType;
      } else {
        return response
          .badRequest()
          .withIssue("SORT_KEY_INVALID", "Chave de ordenação inválida")
          .send();
      }
    }

    const [cities, error] = await CityModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (cities.length === 0)
        return response.notFound("Nenhuma cidade encontrada");

      return response.success(cities);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);

    const [city, error] = await CityModel.findById(req.params.id);

    if (error) {
      return res.status(500).send(APIResponse.internalError());
    } else {
      if (!city) return response.notFound("Cidade não encontrada");

      return response.success(city);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    const [isDeleted, error] = await CityModel.delete(req.params.id);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted) return response.internalError("Falha ao remover cidade");

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    const { name, state } = req.body;

    const [isCreated, error] = await CityModel.create({
      name,
      state,
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isCreated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao cadastrar cidade")
          .send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async edit(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;

    const { name, state } = req.body;

    const [isUpdated, error] = await CityModel.edit({
      id,
      name,
      state,
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao alterar cidade")
          .send();

      return response.success({ success: true });
    }
  }
}
