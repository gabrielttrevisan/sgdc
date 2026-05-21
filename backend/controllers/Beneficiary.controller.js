import APIResponse from "../lib/APIResponse.js";
import BeneficiaryModel from "../models/Beneficiary.model.js";

export default class BeneficiaryController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    /** @type {import("../models/Beneficiary.model.js").FindAllFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    if (q && (typeof q !== "string" || q.trim().length === 0)) {
      return res.status(400).send(
        APIResponse.badRequestError({
          code: "INVALID_QUERY",
          description: "Texto buscado inválido",
        }),
      );
    }

    filter.query = q;

    if (sortKey) {
      if (sortKey === "name") {
        if (!sortType) {
          return res.status(400).send(
            APIResponse.badRequestError({
              code: "SORT_TYPE_MISSING",
              description: `Tipo de ordenação não informado`,
            }),
          );
        }

        if (!["asc", "desc"].includes(sortType))
          return res.status(400).send(
            APIResponse.badRequestError({
              code: "SORT_TYPE_INVALID",
              description: `Tipo de ordenação não compatível com chave de ordenação`,
            }),
          );

        filter.sortKey = sortKey;
        filter.sortType = sortType;
      } else if (sortKey === "request") {
        filter.sortKey = sortKey;
      } else {
        return res.status(400).send(
          APIResponse.badRequestError({
            code: "SORT_KEY_INVALID",
            description: "Chave de ordenação inválida",
          }),
        );
      }
    }

    if (page) {
      const parsedPage = parseInt(page);

      if (isNaN(parsedPage) || parsedPage < 1) {
        return res.status(400).send(
          APIResponse.badRequestError({
            code: "PAGINATION_ERROR",
            description: "Página inválida",
          }),
        );
      }

      filter.page = parsedPage;
    } else filter.page = 1;

    if (perPage) {
      const parsedPerPage = parseInt(perPage);

      if (isNaN(parsedPerPage) || parsedPerPage < 10 || parsedPerPage > 30) {
        return res.status(400).send(
          APIResponse.badRequestError({
            code: "PAGINATION_ERROR",
            description: "Quantidade paginada inadequada",
          }),
        );
      }

      filter.perPage = parsedPerPage;
    } else filter.perPage = 10;

    const [beneficiaries, error] = await BeneficiaryModel.findAll(filter);

    if (error) {
      console.error(error);
      return res.status(500).send(APIResponse.internalError());
    } else {
      if (beneficiaries.length === 0)
        return res
          .status(404)
          .send(APIResponse.notFound("Nenhum beneficiário encontrado"));

      return res.status(200).send(APIResponse.success(beneficiaries));
    }
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    if (!req.params)
      return res.status(400).send(
        APIResponse.badRequestError({
          code: "MISSING_IDENTIFIER",
          description: "Identificador do beneficiário não informado",
        }),
      );

    const { id } = req.params;

    if (!id)
      return res.status(400).send(
        APIResponse.badRequestError({
          code: "MISSING_IDENTIFIER",
          description: "Identificador do beneficiário não informado",
        }),
      );

    const parsedId = parseInt(id);

    if (isNaN(parsedId) || parsedId < 1)
      return res.status(400).send(
        APIResponse.badRequestError({
          code: "INVALID_IDENTIFIER",
          description: "Identificador inválido",
        }),
      );

    const [beneficiary, error] = await BeneficiaryModel.findById(parsedId);

    if (error) {
      console.error(error);
      return res.status(500).send(APIResponse.internalError());
    } else {
      if (!beneficiary)
        return res
          .status(404)
          .send(APIResponse.notFound("Beneficiário não encontrado"));

      return res.status(200).send(APIResponse.success(beneficiary));
    }
  }
}
