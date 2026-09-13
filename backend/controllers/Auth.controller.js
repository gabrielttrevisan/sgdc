import UserCredentialMismatchError from "../exception/UserCredentialMismatchError.js";
import InactiveRoleError from "../exception/InactiveRoleError.js";
import APIResponse from "../lib/APIResponse.js";
import { AuthSingleton } from "../lib/Auth.singleton.js";
import { MenuBuilder } from "../lib/Menu.builder.js";
import AuthModel from "../models/Auth.model.js";

export default class AuthController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async signIn(req, res) {
    const { user, pass } = req.body;
    const [authentication, error] = await AuthModel.signIn({ user, pass });
    const response = APIResponse.from(res);

    if (authentication) {
      AuthSingleton.instance.setRole(
        authentication.user.roleId,
        authentication.permissions,
      );

      return response.success({
        token: authentication.token,
        user: authentication.user,
        menu: MenuBuilder.fromPermissions(
          authentication.permissions,
          authentication.user.id,
        ).getMenu(),
      });
    }

    if (error instanceof UserCredentialMismatchError) {
      return response.error("INVALID_CREDENTIALS", error.message).send(401);
    }

    if (error instanceof InactiveRoleError) {
      return response
        .error("INACTIVE_ROLE", "Não foi possível autenticar o usuário")
        .withIssue("INACTIVE_ROLE", error.message)
        .send(403);
    }

    return response.internalError("Falha ao autenticar usuário");
  }
}
