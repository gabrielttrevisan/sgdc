import UserCredentialMismatchError from "../exception/UserCredentialMismatchError.js";
import InactiveRoleError from "../exception/InactiveRoleError.js";
import APIResponse from "../lib/APIResponse.js";
import { AuthSingleton } from "../lib/Auth.singleton.js";
import { MenuBuilder } from "../lib/Menu.builder.js";
import AuthModel from "../models/Auth.model.js";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

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

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async generateRecoveryToken(req, res) {
    const response = APIResponse.from(res);
    const { user } = req.body;

    const [recovery, error] = await AuthModel.generateRecoveryToken(user.trim());

    if (error) {
      return response.internalError("Falha ao gerar o token de recuperação");
    }

    if (recovery) {
      try {
        const transporter = nodemailer.createTransport({
          service: env.EMAIL_SERVICE,
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
          },
        });
        const recoveryUrl = new URL(
          "/reset-password",
          env.FRONTEND_URL[0],
        );
        recoveryUrl.searchParams.set("token", recovery.token);

        await transporter.sendMail({
          from: env.EMAIL_USER,
          to: recovery.email,
          subject: "Recuperação de senha",
          text: `Acesse o link abaixo para recuperar sua senha:\n${recoveryUrl.toString()}\n\nSe você não solicitou a recuperação de senha, ignore este e-mail.`,
        });
      } catch {
        return response.internalError(
          "Falha ao enviar o token de recuperação por e-mail",
        );
      }
    }

    return response.success(
      {
        message:
          "Se a conta existir, enviaremos instruções para o e-mail cadastrado.",
      },
      202,
    );
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async resetPassword(req, res) {
    const response = APIResponse.from(res);
    const { token, cpf, pass } = req.body;

    const [isUpdated, error] = await AuthModel.resetPassword({
      token: token.trim(),
      cpf: cpf.trim(),
      pass,
    });

    if (error) {
      return response.internalError("Falha ao redefinir a senha");
    }

    if (!isUpdated) {
      return response
        .badRequest("CPF ou token inválido, ou token expirado")
        .send();
    }

    return response.success({ message: "Senha redefinida com sucesso" });
  }
}
