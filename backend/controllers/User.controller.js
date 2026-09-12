import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";
import RecordReferenceError from "../exception/RecordReferenceError.js";
import APIResponse from "../lib/APIResponse.js";
import UserCredentialMismatchError from "../exception/UserCredentialMismatchError.js";
import AuthModel from "../models/Auth.model.js";
import UserModel from "../models/User.model.js";

export default class UserController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/User.model.js").FindAllUsersFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [users, error] = await UserModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (users.length === 0)
        return response.notFound("Nenhum usuário encontrado");

      return response.success(users);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);

    const parsedId = parseInt(req.params.id);

    const [user, error] = await UserModel.findById(parsedId);

    if (error) {
      return res.status(500).send(APIResponse.internalError());
    } else {
      if (!user) return response.notFound("Usuário não encontrado");

      return response.success(user);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    const { nationalId, email, name, pass, userName, roleId } = req.body;
    const userId = req.auth.user.id;

    const [isCreated, error] = await UserModel.create(
      {
        nationalId,
        email,
        name,
        pass,
        userName,
        roleId,
      },
      userId,
    );

    if (error) {
      if (error instanceof DuplicatedFieldError) {
        return response
          .badRequest()
          .withIssue(`DUPLICATED_${error.field}`, error.message)
          .send();
      }

      if (error instanceof RecordReferenceError) {
        return response
          .badRequest()
          .withIssue("ROLE_NOT_FOUND", error.message)
          .send();
      }

      return response.internalError();
    } else {
      if (!isCreated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao cadastrar usuário")
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

    const { name, newPass, pass, username, email, roleId } = req.body;
    const id = parseInt(req.params.id);
    const userId = req.auth.user.id;

    if ((id === userId || newPass !== undefined) && !pass) {
      return response
        .badRequest()
        .withIssue("MISSING_PASSWORD", "Senha atual não fornecida")
        .send();
    }

    if (pass) {
      const [isPasswordValid, passwordError] = await AuthModel.checkPassword(
        userId,
        pass,
      );

      if (passwordError) return response.internalError();

      if (!isPasswordValid) {
        const error = new UserCredentialMismatchError();

        return response
          .badRequest()
          .withIssue("INVALID_PASSWORD", error.message)
          .send();
      }
    }

    const [isUpdated, error] = await UserModel.edit(
      {
        id,
        roleId,
        email,
        name,
        newPass,
        username,
      },
      userId,
    );

    if (error) {
      if (error instanceof DuplicatedFieldError) {
        return response
          .badRequest()
          .withIssue(`DUPLICATED_${error.field}`, error.message)
          .send();
      }

      if (error instanceof RecordReferenceError) {
        return response
          .badRequest()
          .withIssue("ROLE_NOT_FOUND", error.message)
          .send();
      }

      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao editar usuário")
          .send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async deactivate(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;
    const userId = req.auth.user.id;

    const [isDeactivated, error] = await UserModel.deactivate(id, userId);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeactivated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao desativar usuário")
          .send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async reactivate(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;

    const [isDeactivated, error] = await UserModel.reactivate(id);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeactivated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao reativar usuário")
          .send();

      return response.success({ success: true });
    }
  }
}
