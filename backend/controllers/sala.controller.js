import APIResponse from "../lib/APIResponse.js";
import SalaModel from "../models/Sala.model.js";

export default class SalaController {

  static async findAll(req, res) {

    const response = APIResponse.from(res);

    const { q, page, perPage } = req.query;

    const filter = {
      query: q,
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 10,
    };

    const [salas, error] =
      await SalaModel.findAll(filter);

    if (error)
      return response.internalError();

    return response.success(salas);
  }

  static async findById(req, res) {

    const response = APIResponse.from(res);

    const id =
      parseInt(req.params.id);

    const [sala, error] =
      await SalaModel.findById(id);

    if (error)
      return response.internalError();

    if (!sala)
      return response.notFound(
        "Sala não encontrada"
      );

    return response.success(sala);
  }

  static async create(req, res) {

    const response =
      APIResponse.from(res);

    const {
      nome,
      capacidade,
      descricao
    } = req.body;

    const [created, error] =
      await SalaModel.create({
        nome,
        capacidade,
        descricao
      });

    if (error)
      return response.internalError();

    if (!created)
      return response.badRequest()
        .withIssue(
          "INSERT_FAILURE",
          "Falha ao cadastrar sala"
        )
        .send();

    return response.success({
      success: true
    });
  }

  static async edit(req, res) {

    const response =
      APIResponse.from(res);

    const id =
      parseInt(req.params.id);

    const {
      nome,
      capacidade,
      descricao
    } = req.body;

    const [updated, error] =
      await SalaModel.edit({
        id,
        nome,
        capacidade,
        descricao
      });

    if (error)
      return response.internalError();

    if (!updated)
      return response.badRequest()
        .withIssue(
          "UPDATE_FAILURE",
          "Sala não encontrada"
        )
        .send();

    return response.success({
      success: true
    });
  }

  static async delete(req, res) {

    const response =
      APIResponse.from(res);

    const id =
      parseInt(req.params.id);

    const [deleted, error] =
      await SalaModel.delete(id);

    if (error)
      return response.internalError();

    if (!deleted)
      return response.badRequest()
        .withIssue(
          "DELETE_FAILURE",
          "Sala não encontrada"
        )
        .send();

    return response.success({
      success: true
    });
  }
}