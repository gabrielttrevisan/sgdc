import APIResponse from "../lib/APIResponse.js";
import VolunteerModel from "../models/Volunteer.model.js";

export default class VolunteerController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [volunteers, error] = await VolunteerModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (!volunteers || volunteers.items.length === 0)
        return response.notFound("Nenhum voluntário encontrado");

      return response.success(volunteers);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);

    const [volunteer, error] = await VolunteerModel.findById(req.params.id);

    if (error) {
      return response.internalError();
    } else {
      if (!volunteer) return response.notFound("Voluntário não encontrado");

      return response.success(volunteer);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    const [isDeleted, error] = await VolunteerModel.delete(req.params.id);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted) return response.notFound("Voluntário não encontrado para remoção");

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const {
      name, gender, nationalId, phone, phoneSecondary,
      hasWhatsApp, hasWhatsAppSecondary, street, number,
      complement, neighborhood, city, state
    } = req.body;

    const [isCreated, error] = await VolunteerModel.create({
      name, gender, nationalId, phone, phoneSecondary,
      hasWhatsApp, hasWhatsAppSecondary, street, number,
      complement, neighborhood, city, state
    });

    if (error) {
      if (error.isDuplicate) {
        return response
          .badRequest()
          .withIssue("DUPLICATE_FIELD", error.message)
          .send();
      }
      return response.internalError();
    } else {
      if (!isCreated) return response.badRequest().withIssue("INSERT_FAILURE", "Falha ao cadastrar").send();
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

    const {
      name, gender, nationalId, phone, phoneSecondary,
      hasWhatsApp, hasWhatsAppSecondary, street, number,
      complement, neighborhood, city, state
    } = req.body;

    const [isUpdated, error] = await VolunteerModel.edit({
      id,
      name, gender, nationalId, phone, phoneSecondary,
      hasWhatsApp, hasWhatsAppSecondary, street, number,
      complement, neighborhood, city, state
    });

    if (error) {
      return response.internalError();
    } else {
      if (!isUpdated) return response.notFound("Voluntário não encontrado para alteração");
      return response.success({ success: true });
    }
  }
}