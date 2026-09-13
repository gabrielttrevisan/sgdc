import APIResponse from "../lib/APIResponse.js";
import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";
import { RoleModel } from "../models/Role.model.js";

export class RoleController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const { name, permissions } = req.body;

    const [isCreated, error] = await RoleModel.create({ name, permissions });

    if (error) {
      if (error instanceof DuplicatedFieldError) {
        return response
          .badRequest()
          .withIssue(`DUPLICATED_${error.field}`, error.message)
          .send();
      }

      return response.internalError();
    }

    if (!isCreated)
      return response
        .badRequest()
        .withIssue("INSERT_FAILURE", "Falha ao cadastrar nível de acesso")
        .send();

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Role.model.js").FindAllRolesFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [cities, error] = await RoleModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (cities.length === 0)
        return response.notFound("Nenhum nível de acesso encontrado");

      return response.success(cities);
    }
  }
}
