import APIResponse from "../lib/APIResponse.js";
import AllocationTypeModel from "../models/AllocationType.model.js";

export default class AllocationTypeController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/AllocationType.model.js").FindAllAllocationTypesFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [cities, error] = await AllocationTypeModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (cities.length === 0)
        return response.notFound("Nenhum tipo de alocação encontrada");

      return response.success(cities);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    const [isDeleted, error] = await AllocationTypeModel.delete(req.params.id);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted)
        return response.internalError("Falha ao remover tipo de alocação");

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    const { name, description } = req.body;

    const [isCreated, error] = await AllocationTypeModel.create({
      name,
      description,
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isCreated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao cadastrar tipo de alocação")
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

    const { name, description } = req.body;

    const [isUpdated, error] = await AllocationTypeModel.edit({
      id,
      name,
      description,
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao alterar tipo de alocação")
          .send();

      return response.success({ success: true });
    }
  }
}
