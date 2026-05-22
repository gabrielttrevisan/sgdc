import APIResponse from "../lib/APIResponse.js";
import BeneficiaryModel from "../models/Beneficiary.model.js";

export default class BeneficiaryController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Beneficiary.model.js").FindAllFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    if (q && (typeof q !== "string" || q.trim().length === 0)) {
      return response
        .badRequest()
        .withIssue("INVALID_QUERY", "Texto buscado inválido")
        .send();
    }

    filter.query = q;

    if (sortKey) {
      if (sortKey === "name") {
        if (!sortType) {
          return response
            .badRequest()
            .withIssue("SORT_TYPE_MISSING", `Tipo de ordenação não informado`)
            .send();
        }

        if (!["asc", "desc"].includes(sortType))
          return response
            .badRequest()
            .withIssue(
              "SORT_TYPE_INVALID",
              `Tipo de ordenação não compatível com chave de ordenação`,
            )
            .send();

        filter.sortKey = sortKey;
        filter.sortType = sortType;
      } else if (sortKey === "request") {
        filter.sortKey = sortKey;
      } else {
        return response
          .badRequest()
          .withIssue("SORT_KEY_INVALID", "Chave de ordenação inválida")
          .send();
      }
    }

    if (page) {
      const parsedPage = parseInt(page);

      if (isNaN(parsedPage) || parsedPage < 1) {
        return response
          .badRequest()
          .withIssue("PAGINATION_ERROR", "Página inválida")
          .send();
      }

      filter.page = parsedPage;
    } else filter.page = 1;

    if (perPage) {
      const parsedPerPage = parseInt(perPage);

      if (isNaN(parsedPerPage) || parsedPerPage < 10 || parsedPerPage > 30) {
        return response
          .badRequest()
          .withIssue("PAGINATION_ERROR", "Quantidade paginada inadequada")
          .send();
      }

      filter.perPage = parsedPerPage;
    } else filter.perPage = 10;

    const [beneficiaries, error] = await BeneficiaryModel.findAll(filter);

    if (error) {
      return response.internalError();
    } else {
      if (beneficiaries.length === 0)
        return response.notFound("Nenhum beneficiário encontrado");

      return response.success(beneficiaries);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);

    if (!req.params)
      return response
        .badRequest()
        .withIssue(
          "MISSING_IDENTIFIER",
          "Identificador do beneficiário não informado",
        )
        .send();

    const { id } = req.params;

    if (!id)
      return response
        .badRequest()
        .withIssue(
          "MISSING_IDENTIFIER",
          "Identificador do beneficiário não informado",
        )
        .send();

    const parsedId = parseInt(id);

    if (isNaN(parsedId) || parsedId < 1)
      return response
        .badRequest()
        .withIssue("INVALID_IDENTIFIER", "Identificador inválido")
        .send();

    const [beneficiary, error] = await BeneficiaryModel.findById(parsedId);

    if (error) {
      return res.status(500).send(APIResponse.internalError());
    } else {
      if (!beneficiary) return response.notFound("Beneficiário não encontrado");

      return response.success(beneficiary);
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);

    if (!req.params)
      return response
        .badRequest({
          code: "MISSING_IDENTIFIER",
          description: "Identificador do beneficiário não informado",
        })
        .send();

    const { id } = req.params;

    if (!id)
      return response.badRequest({
        code: "MISSING_IDENTIFIER",
        description: "Identificador do beneficiário não informado",
      });

    const parsedId = parseInt(id);

    if (isNaN(parsedId) || parsedId < 1)
      return response.badRequest({
        code: "INVALID_IDENTIFIER",
        description: "Identificador inválido",
      });

    const [isDeleted, error] = await BeneficiaryModel.delete(parsedId);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted)
        return response.internalError("Falha ao criar beneficiário");

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
      name,
      gender,
      nationalId,
      phone,
      street,
      number,
      complement = "",
      neighborhood,
      state,
      city,
    } = req.body;

    const [isCreated, error] = await BeneficiaryModel.create({
      name,
      gender,
      nationalId,
      phone,
      street,
      number,
      complement,
      neighborhood,
      state,
      city,
    });

    if (error) {
      if (error?.message.includes("beneficiaries.NATIONAL_ID")) {
        return response
          .badRequest()
          .withIssue(
            "DUPLICATE_BENEFICIARY",
            "Já existe um beneficiário cadastrado com esse CPF",
          )
          .send();
      }

      if (error?.message.includes("FK_BENEFICIARIES_CITIES")) {
        return response
          .badRequest()
          .withIssue("CITY_NOT_FOUND", "Cidade inexistente")
          .send();
      }

      return response.internalError();
    } else {
      if (!isCreated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Beneficiário não encontrado")
          .send();

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
      name,
      gender,
      nationalId,
      phone,
      street,
      number,
      complement = "",
      neighborhood,
      state,
      city,
    } = req.body;

    const [isUpdated, error] = await BeneficiaryModel.edit({
      id,
      name,
      gender,
      nationalId,
      phone,
      street,
      number,
      complement,
      neighborhood,
      state,
      city,
    });

    if (error) {
      if (error?.message.includes("beneficiaries.NATIONAL_ID")) {
        return response
          .badRequest()
          .withIssue(
            "DUPLICATE_BENEFICIARY",
            "Já existe um beneficiário cadastrado com esse CPF",
          )
          .send();
      }

      if (error?.message.includes("FK_BENEFICIARIES_CITIES")) {
        return response
          .badRequest()
          .withIssue("CITY_NOT_FOUND", "Cidade inexistente")
          .send();
      }

      return response.internalError();
    } else {
      if (!isUpdated)
        return response
          .badRequest()
          .withIssue("INSERT_FAILURE", "Beneficiário não encontrado")
          .send();

      return response.success({ success: true });
    }
  }
}
