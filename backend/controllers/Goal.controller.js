import APIResponse from "../lib/APIResponse.js";
import GoalModel from "../models/Goal.model.js";

export default class GoalController {
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, page, perPage } = req.query;
    const [goals, error] = await GoalModel.findAll({
      query: q,
      page: page ? parseInt(page, 10) : 1,
      perPage: perPage ? parseInt(perPage, 10) : 10,
    });

    if (error) return response.internalError();
    return response.success(goals);
  }

  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [goal, error] = await GoalModel.findById(parseInt(req.params.id, 10));

    if (error) return response.internalError();
    if (!goal) return response.notFound("Meta não encontrada");
    return response.success(goal);
  }

  static async create(req, res) {
    const response = APIResponse.from(res);
    const { name, description, startAt, endAt, goal, unitId, isGlobal } =
      req.body;
    const [created, error] = await GoalModel.create(
      {
        name: name?.trim() || GoalController.#defaultName(startAt, endAt),
        description: description?.trim() || null,
        startAt,
        endAt,
        goal: Number(goal),
        unitId: unitId == null || unitId === "" ? null : Number(unitId),
        isGlobal: isGlobal == null ? true : isGlobal === true || isGlobal === "true",
      },
      req.auth.user.id,
    );

    if (error === "UNIT_NOT_FOUND")
      return response.badRequest("Unidade de medida não encontrada").send();
    if (error) return response.internalError();
    if (!created) return response.badRequest("Falha ao cadastrar meta").send();

    return response.success({ success: true, id: created.id }, 201);
  }

  static #defaultName(startAt, endAt) {
    const [startYear, startMonth] = startAt.split("-").map(Number);
    const [endYear, endMonth] = endAt.split("-").map(Number);
    const months = new Set();

    for (
      let year = startYear, month = startMonth;
      (year < endYear || month <= endMonth) && months.size < 12;
    ) {
      months.add(
        new Intl.DateTimeFormat("pt-BR", {
          month: "long",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(year, month - 1, 1))),
      );
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    const monthNames = [...months];

    return monthNames.length === 1
      ? `Meta do mês ${monthNames[0]}`
      : `Meta dos meses ${monthNames.join(", ")}`;
  }
}
