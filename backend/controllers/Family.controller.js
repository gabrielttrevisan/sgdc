import APIResponse from "../lib/APIResponse.js";
import FamilyModel from "../models/Family.model.js";

export class FamilyController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    try {
      const [created, error] = await FamilyModel.create(req.body);

      if (created) return response.success({ success: true });
      else {
        console.error(error);
        return response.internalError(error?.message);
      }
    } catch (e) {
      console.error(e);
      return response.internalError(e?.message);
    }
  }
}
