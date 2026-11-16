import APIResponse from "../lib/APIResponse.js";
import DonationModel, {
  DonationNotFoundError,
  DonationValidationError,
  InsufficientDonationStockError,
} from "../models/Donation.model.js";

export default class DonationController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, page, perPage } = req.query;
    const [donations, error] = await DonationModel.findAll({
      query: q,
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
    });

    if (error) return response.internalError();
    return response.success(donations);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [donation, error] = await DonationModel.findById(
      parseInt(req.params.id, 10),
    );

    if (error) return response.internalError();
    if (!donation) return response.notFound("Doação não encontrada");
    return response.success(donation);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async getBeneficiaryContext(req, res) {
    const response = APIResponse.from(res);
    const [context, error] = await DonationModel.getBeneficiaryContext(
      parseInt(req.params.id, 10),
    );

    if (error) return response.internalError();
    if (!context) return response.notFound("Beneficiário não encontrado");
    return response.success(context);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const [created, error] = await DonationModel.create(
      req.body,
      req.auth.user.id,
    );

    if (error instanceof InsufficientDonationStockError)
      return response
        .badRequest(error.message)
        .withIssue("INSUFFICIENT_STOCK", error.message)
        .send();
    if (error instanceof DonationValidationError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!created)
      return response.badRequest("Falha ao registrar doação").send();

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async cancel(req, res) {
    const response = APIResponse.from(res);
    const [cancelled, error] = await DonationModel.cancel(
      parseInt(req.params.id, 10),
      req.auth.user.id,
      req.body.details,
    );

    if (error instanceof DonationNotFoundError)
      return response.notFound(error.message);
    if (error instanceof DonationValidationError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!cancelled)
      return response.badRequest("Falha ao cancelar doação").send();

    return response.success({ success: true });
  }
}
