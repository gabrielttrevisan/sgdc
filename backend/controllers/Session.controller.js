import APIResponse from "../lib/APIResponse.js";
import SessionModel from "../models/Session.model.js";

export default class SessionController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const [isCreated, error] = await SessionModel.create(req.body);

    if (error) {
      console.error(error);
      return response.internalError();
    }

    if (!isCreated) {
      return response
        .badRequest("Falha ao registrar atendimento")
        .withIssue("INSERT_FAILURE", "Falha ao registrar atendimento")
        .send();
    }

    return response.success({ success: true });
  }
}
