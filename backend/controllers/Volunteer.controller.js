import APIResponse from "../lib/APIResponse.js";
import VolunteerModel from "../models/Volunteer.model.js";

export default class VolunteerController {
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
    }

    if (!volunteers || volunteers.items.length === 0) {
      return response.notFound("Nenhum voluntário encontrado");
    }

    return response.success(volunteers);
  }

  static async findById(req, res) {
    const response = APIResponse.from(res);
    const parsedId = parseInt(req.params.id);
    const [volunteer, error] = await VolunteerModel.findById(parsedId);

    if (error) {
      return response.internalError();
    }

    if (!volunteer) {
      return response.notFound("Voluntário não encontrado");
    }
    return response.success(volunteer);
  }

  static async delete(req, res) {
    const response = APIResponse.from(res);
    const parsedId = parseInt(req.params.id);
    const [isDeleted, error] = await VolunteerModel.delete(parsedId);

    if (error) {
      return response.internalError();
    }

    if (!isDeleted) {
      return response.notFound(
        "Voluntário não encontrado para remoção",
      );
    }

    return response.success({ success: true });
  }

  static async create(req, res) {
    const response = APIResponse.from(res);
    const {name, gender, nationalId, phone, phoneSecondary, hasWhatsApp, hasWhatsAppSecondary, street, number, complement, neighborhood, city, state,
    } = req.body;
    const [isCreated, error] =
      await VolunteerModel.create({ name, gender, nationalId, phone, phoneSecondary, hasWhatsApp, hasWhatsAppSecondary, street, number, complement, neighborhood, city, state});

    if (error) {
      if (error.isDuplicate) {
        return response
          .badRequest()
          .withIssue(
            "DUPLICATE_FIELD",
            error.message,
          )
          .send();
      }

      return response.internalError();
    }

    if (!isCreated) {
      return response
        .badRequest()
        .withIssue(
          "INSERT_FAILURE",
          "Falha ao cadastrar",
        )
        .send();
    }

    return response.success({ success: true });
  }

  static async edit(req, res) {
    const response = APIResponse.from(res);

    const parsedId = parseInt(req.params.id);

    const {name, gender, nationalId, phone, phoneSecondary, hasWhatsApp, hasWhatsAppSecondary, street, number, complement, neighborhood, city, state,
    } = req.body;

    const [isUpdated, error] =
      await VolunteerModel.edit({id: parsedId, name, gender, nationalId, phone, phoneSecondary, hasWhatsApp, hasWhatsAppSecondary, street, number, complement, neighborhood, city, state});

    if (error) {
      return response.internalError();
    }

    if (!isUpdated) {
      return response
        .notFound(
          "Voluntário não encontrado para alteração",
        );
    }

    return response.success({ success: true });
  }
}