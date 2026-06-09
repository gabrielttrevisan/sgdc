import ExintingFamilyParticipantsError from "../exception/ExistingFamilyParticipants.js";
import APIResponse from "../lib/APIResponse.js";
import FamilyModel from "../models/Family.model.js";

export class FamilyController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Family.model.js").FindAllFamiliesFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [families, error] = await FamilyModel.findAll(filter);

    if (error) {
      return response.internalError(error.message);
    } else {
      if (families.length === 0)
        return response.notFound("Nenhuma família encontrada");

      return response.success(families);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    try {
      const [isCreated, error] = await FamilyModel.create(req.body);

      if (isCreated) return response.success({ success: true });
      else {
        console.error(error);
        return response.internalError(error?.message);
      }
    } catch (e) {
      console.error(e);
      return response.internalError(e?.message);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async edit(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;
    const { name, participants } = req.body;

    try {
      const [isEdited, error] = await FamilyModel.edit({
        id,
        name,
        participants,
      });

      if (isEdited) return response.success({ success: true });
      else {
        console.error(error);
        return response.internalError(error?.message);
      }
    } catch (e) {
      console.error(e);
      return response.internalError(e?.message);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    const [isDeleted, error] = await FamilyModel.delete(req.params.id);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted) return response.internalError("Falha ao remover cidade");

      return response.success({ success: true });
    }
  }
}
