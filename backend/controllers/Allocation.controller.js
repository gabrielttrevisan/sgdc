import APIResponse from "../lib/APIResponse.js";
import AllocationModel from "../models/Allocation.model.js";
import RecordNotFoundError from "../exception/RecordNotFoundError.js";
import ScheduleConflictError from "../exception/ScheduleConflictError.js";
import AllocationTypeInUseError from "../exception/AllocationTypeInUseError.js";

export default class AllocationController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    /** @type {import("../models/Allocation.model.js").FindAllAllocationsFilter} */
    const filter = {};
    const { q, sortKey, sortType, page, perPage } = req.query;

    filter.query = q;
    filter.page = page ? parseInt(page) : 1;
    filter.perPage = perPage ? parseInt(perPage) : 10;
    filter.sortKey = sortKey;
    filter.sortType = sortType;

    const [allocations, error] = await AllocationModel.findAll(filter);

    if (error) return response.internalError();

    if (!allocations || allocations.items.length === 0)
      return response.notFound("Nenhuma alocação encontrada");

    return response.success(allocations);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);
    const parsedId = parseInt(req.params.id);
    const [allocation, error] = await AllocationModel.findById(parsedId);

    if (error) return response.internalError();

    if (!allocation) return response.notFound("Alocação não encontrada");

    return response.success(allocation);
  }

  /**
   * Retorna a alocação em andamento do voluntário, ou `null` quando não há.
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findCurrentByVolunteer(req, res) {
    const response = APIResponse.from(res);
    const parsedId = parseInt(req.params.id);
    const [allocation, error] =
      await AllocationModel.findCurrentByVolunteer(parsedId);

    if (error) return response.internalError();

    return response.success(allocation);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const { volunteerId, allocationTypeId, startAt, endAt, notes } = req.body;

    const [isCreated, error] = await AllocationModel.create({
      volunteerId: parseInt(volunteerId),
      allocationTypeId: parseInt(allocationTypeId),
      startAt,
      endAt,
      notes: AllocationController.#parseNotes(notes),
    });

    if (error) return AllocationController.#handleWriteError(response, error);

    if (!isCreated)
      return response
        .badRequest()
        .withIssue("INSERT_FAILURE", "Falha ao cadastrar alocação")
        .send();

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async edit(req, res) {
    const response = APIResponse.from(res);
    const parsedId = parseInt(req.params.id);
    const { allocationTypeId, startAt, endAt, notes } = req.body;

    const [isUpdated, error] = await AllocationModel.edit({
      id: parsedId,
      allocationTypeId: parseInt(allocationTypeId),
      startAt,
      endAt,
      notes: AllocationController.#parseNotes(notes),
    });

    if (error) return AllocationController.#handleWriteError(response, error);

    if (!isUpdated)
      return response.notFound("Alocação não encontrada para alteração");

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async delete(req, res) {
    const response = APIResponse.from(res);
    const parsedId = parseInt(req.params.id);
    const [isDeleted, error] = await AllocationModel.delete(parsedId);

    if (error) return response.internalError();

    if (!isDeleted)
      return response.notFound("Alocação não encontrada para remoção");

    return response.success({ success: true });
  }

  /**
   * @param {string} [notes]
   * @returns {string|null}
   */
  static #parseNotes(notes) {
    if (typeof notes !== "string") return null;

    const trimmed = notes.trim();

    return trimmed.length === 0 ? null : trimmed;
  }

  /**
   * @param {APIResponse} response
   * @param {Error} error
   */
  static #handleWriteError(response, error) {
    if (error instanceof ScheduleConflictError)
      return response
        .badRequest()
        .withIssue("SCHEDULE_CONFLICT", error.message)
        .send();

    if (error instanceof AllocationTypeInUseError)
      return response
        .badRequest()
        .withIssue("ALLOCATION_TYPE_IN_USE", error.message)
        .send();

    if (error instanceof RecordNotFoundError)
      return response.notFound(error.message);

    return response.internalError();
  }
}
