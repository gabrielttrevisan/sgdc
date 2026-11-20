import APIResponse from "../lib/APIResponse.js";
import DiscardModel, {
  DiscardValidationError,
  InsufficientDiscardStockError,
} from "../models/Discard.model.js";
import createDiscardReportFile from "../lib/DiscardReportExport.js";

export default class DiscardController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, page, perPage } = req.query;
    const [discards, error] = await DiscardModel.findAll({
      query: q,
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
    });

    if (error) return response.internalError();
    return response.success(discards);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findForReport(req, res) {
    const response = APIResponse.from(res);
    const { startAt, endAt, products, page, perPage, format } = req.query;
    const [discards, error] = await DiscardModel.findForReport({
      startAt,
      endAt,
      products:
        typeof products === "string"
          ? products.split(",").map((id) => Number(id))
          : undefined,
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
      all: Boolean(format),
    });

    if (error) return response.internalError();

    if (format) {
      try {
        const file = await createDiscardReportFile(discards.items, format);

        res.set("Content-Type", file.contentType);
        res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

        return res.status(200).send(file.buffer);
      } catch (exportError) {
        console.error(exportError);
        return response.internalError("Não foi possível gerar o arquivo do relatório");
      }
    }

    return response.success(discards);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [discard, error] = await DiscardModel.findById(
      parseInt(req.params.id, 10),
    );

    if (error) return response.internalError();
    if (!discard) return response.notFound("Descarte não encontrado");
    return response.success(discard);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const [created, error] = await DiscardModel.create(
      req.body,
      req.auth.user.id,
    );

    if (error instanceof InsufficientDiscardStockError)
      return response
        .badRequest(error.message)
        .withIssue("INSUFFICIENT_STOCK", error.message)
        .send();
    if (error instanceof DiscardValidationError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!created)
      return response.badRequest("Falha ao registrar descarte").send();

    return response.success({ success: true });
  }
}
