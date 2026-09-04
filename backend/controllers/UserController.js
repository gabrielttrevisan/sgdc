import DuplicatedFieldError from "../exception/DuplicatedFieldError.js";
import RecordReferenceError from "../exception/RecordReferenceError.js";
import APIResponse from "../lib/APIResponse.js";
import UserModel from "../models/User.model.js";

export default class UserController {
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
      { userId },
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
}
