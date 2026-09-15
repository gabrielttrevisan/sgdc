import APIResponse from "../lib/APIResponse.js";
import BeneficiaryModel from "../models/Beneficiary.model.js";

export default class BeneficiaryController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Beneficiary.model.js").FindAllBeneficiariesFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

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
  static async findAllWithoutFamily(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Beneficiary.model.js").FindAllBeneficiariesFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [beneficiaries, error] =
      await BeneficiaryModel.findAllWithoutFamily(filter);

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

    const parsedId = parseInt(req.params.id);

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

    const parsedId = parseInt(req.params.id);

    const [isDeleted, error] = await BeneficiaryModel.delete(parsedId);

    if (error) {
      return response.internalError();
    } else {
      if (!isDeleted)
        return response.internalError("Falha ao deletar beneficiário");

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
      city,
    } = req.body;

    const [isUpdated, error] = await BeneficiaryModel.edit({
      id: parseInt(id),
      name,
      gender,
      nationalId,
      phone,
      street,
      number,
      complement,
      neighborhood,
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
