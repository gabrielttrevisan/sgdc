import { SameDueDateError } from "../exception/SameDueDateError.js";
import APIResponse from "../lib/APIResponse.js";
import BillModel from "../models/Bill.model.js";

export default class BillController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Bill.model.js").FindAllBillsFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [cities, error] = await BillModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (cities.length === 0)
        return response.notFound("Nenhum tipo de alocação encontrada");

      return response.success(cities);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);

    const parsedId = parseInt(req.params.id);

    const [bill, error] = await BillModel.findById(parsedId);

    if (error) {
      return res.status(500).send(APIResponse.internalError());
    } else {
      if (!bill) return response.notFound("Conta a pagar não encontrado");

      return response.success(bill);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);

    const { dueDate, value, description } = req.body;

    const [isCreated, error] = await BillModel.create(
      {
        description,
        dueDate,
        value,
      },
      req.auth.user,
    );

    if (error) {
      return response.internalError();
    } else {
      if (!isCreated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Falha ao lançar Conta a Pagar")
          .send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async pay(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;

    const [isUpdated, error] = await BillModel.pay(
      {
        id,
      },
      req.auth.user,
    );

    if (error) {
      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest("Falha ao dar baixa em conta a pagar")
          .send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async cancel(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;
    const { details } = req.body;

    const [isUpdated, error] = await BillModel.cancel(
      {
        id,
        details,
      },
      req.auth.user,
    );

    if (error) {
      return response.internalError();
    } else {
      if (!isUpdated)
        return response.badRequest("Falha ao cancelar conta a pagar").send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async cancelAndCopy(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;
    const { cancelationDetails, description, dueDate, value } = req.body;

    const [isCanceledAndCopied, error] = await BillModel.cancelAndCopy(
      {
        id,
        cancelationDetails,
        description,
        dueDate,
        value,
      },
      req.auth.user,
    );

    if (error) {
      console.error(error);
      return response.internalError();
    } else {
      if (!isCanceledAndCopied)
        return response
          .badRequest("Falha ao cancelar e copiar conta a pagar")
          .send();

      return response.success({ success: true });
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async extend(req, res) {
    const response = APIResponse.from(res);

    const { id } = req.params;
    const { details, newDueDate } = req.body;

    const [isUpdated, error] = await BillModel.extend(
      {
        id,
        details,
        newDueDate,
      },
      req.auth.user,
    );

    if (error) {
      if (error instanceof SameDueDateError) {
        return response
          .badRequest("Falha ao adiar conta a pagar")
          .withIssue(
            "SAME_DUE_DATES",
            "A nova data de vencimento é idêtica a antiga",
          )
          .send();
      }

      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest("Falha ao adiar conta a pagar")
          .withIssue(
            "INSERT_FAILURE",
            "A conta a pagar não pode estar cancelada, paga ou já ter sido adiada uma vez",
          )
          .send();

      return response.success({ success: true });
    }
  }
}
