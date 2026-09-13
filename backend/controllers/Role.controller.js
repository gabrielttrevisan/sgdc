import APIResponse from "../lib/APIResponse.js";
import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";
import ForeignKeyViolationError from "../exception/ForeignKeyViolationError.js";
import { RoleModel } from "../models/Role.model.js";

export class RoleController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const { name, description, permissions } = req.body;

    const [isCreated, error] = await RoleModel.create({
      name,
      description,
      permissions,
    });

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
    const { q, filter: roleFilter, sortKey, sortType, page, perPage } =
      req.query;

    filter.query = q;
    filter.filter = roleFilter;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [roles, error] = await RoleModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (roles.items.length === 0)
        return response.notFound("Nenhum nível de acesso encontrado");

      return response.success(roles);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);

    const [role, error] = await RoleModel.findById(parseInt(req.params.id));

    if (error) return response.internalError();

    if (!role) return response.notFound("Nível de acesso não encontrado");

    return response.success(role);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    const [isDeleted, error] = await RoleModel.delete(req.params.id);

    if (error) return response.internalError();

    if (!isDeleted)
      return response.internalError("Falha ao remover nível de acesso");

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async edit(req, res) {
    const response = APIResponse.from(res);
    const { name, description, permissions } = req.body;

    const [isUpdated, error] = await RoleModel.edit({
      id: parseInt(req.params.id),
      name,
      description,
      permissions,
    });

    if (error) {
      if (error instanceof DuplicatedFieldError)
        return response
          .badRequest()
          .withIssue(`DUPLICATED_${error.field}`, error.message)
          .send();

      return response.internalError();
    }

    if (!isUpdated)
      return response
        .badRequest()
        .withIssue("UPDATE_FAILURE", "Falha ao editar nível de acesso")
        .send();

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async restore(req, res) {
    const response = APIResponse.from(res);

    const [isRestored, error] = await RoleModel.restore(req.params.id);

    if (error) return response.internalError();

    if (!isRestored)
      return response.internalError("Falha ao reativar nível de acesso");

    return response.success({ success: true });
  }
}
