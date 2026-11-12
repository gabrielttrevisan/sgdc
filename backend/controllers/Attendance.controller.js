import APIResponse from "../lib/APIResponse.js";
import AttendanceModel, {
  ClosedAttendanceError,
  OpenAttendanceExistsError,
} from "../models/Attendance.model.js";

export default class AttendanceController {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async create(req, res) {
    const response = APIResponse.from(res);
    const [isCreated, error] = await AttendanceModel.create(req.body);

    if (error instanceof OpenAttendanceExistsError) {
      return response
        .badRequest(error.message)
        .withIssue("OPEN_ATTENDANCE", error.message)
        .send();
    }

    if (error) return response.internalError();

    if (!isCreated) {
      return response
        .badRequest("Falha ao registrar atendimento")
        .withIssue("INSERT_FAILURE", "Falha ao registrar atendimento")
        .send();
    }

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findAll(req, res) {
    const response = APIResponse.from(res);
    const { q, page, perPage } = req.query;
    const [attendances, error] = await AttendanceModel.findAll({
      query: q,
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 10,
    });

    if (error) return response.internalError();

    return response.success(attendances);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async findById(req, res) {
    const response = APIResponse.from(res);
    const [attendance, error] = await AttendanceModel.findById(
      parseInt(req.params.id),
    );

    if (error) return response.internalError();
    if (!attendance) return response.notFound("Atendimento não encontrado");

    return response.success(attendance);
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async update(req, res) {
    const response = APIResponse.from(res);
    const [isUpdated, error] = await AttendanceModel.update({
      id: parseInt(req.params.id),
      ...req.body,
    });

    if (error instanceof ClosedAttendanceError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!isUpdated)
      return response.badRequest("Falha ao atualizar atendimento").send();

    return response.success({ success: true });
  }

  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  static async cancel(req, res) {
    const response = APIResponse.from(res);
    const [isCancelled, error] = await AttendanceModel.cancel(
      {
        id: parseInt(req.params.id),
        reason: req.body.reason,
      },
      req.auth.user,
    );

    if (error instanceof ClosedAttendanceError)
      return response.badRequest(error.message).send();
    if (error) return response.internalError();
    if (!isCancelled)
      return response.badRequest("Falha ao cancelar atendimento").send();

    return response.success({ success: true });
  }
}
