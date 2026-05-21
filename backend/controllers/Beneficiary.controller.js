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
    const { q, sortKey, sortType } = req.query;

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

    const [beneficiaries, error] = await BeneficiaryModel.findAll(filter);

    if (error) {
      if (error?.message?.includes("unique")) {
        return res.status(400).send(
          APIResponse.badRequestError({
            code: "UNIQUE_CONSTRAINT",
            description: "CPF já cadastrado",
          }),
        );
      } else {
        console.error(error);
        return res.status(500).send(APIResponse.internalError());
      }
    } else {
      return res.status(200).send(APIResponse.success(beneficiaries));
    }
  }
}
