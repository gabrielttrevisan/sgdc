import APIResponse from "../lib/APIResponse.js";
import MeasuringUnitModel from "../models/MeasuringUnit.model.js";

export default class MeasuringUnitController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/MeasuringUnit.model.js").FindAllMeasuringUnitsFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [cities, error] = await MeasuringUnitModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (cities.length === 0)
        return response.notFound("Nenhuma unidade de medida encontrada");

      return response.success(cities);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    const [isDeleted, error] = await MeasuringUnitModel.delete(req.params.id);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted)
        return response.internalError("Falha ao remover unidade de medida");

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    const { name, symbol } = req.body;

    const [isCreated, error] = await MeasuringUnitModel.create({
      name,
      symbol,
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isCreated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao cadastrar unidade de medida")
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

    const { name, symbol } = req.body;

    const [isUpdated, error] = await MeasuringUnitModel.edit({
      id,
      name,
      symbol,
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao alterar unidade de medida")
          .send();

      return response.success({ success: true });
    }
  }
}
