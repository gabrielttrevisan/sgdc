import { Router } from "express";
import AttendanceController from "../controllers/Attendance.controller.js";
import requiresPermission from "../middlewares/permission.js";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import {
  CANCEL_ATTENDANCE_RULES,
  CREATE_ATTENDANCE_RULES,
  UPDATE_ATTENDANCE_RULES,
} from "../validators/attendance.validator.js";

const attendanceRouter = Router();
const canManageAttendance = requiresPermission.forResource("attendance");

attendanceRouter.get(
  "/",
  canManageAttendance.withAction("list"),
  pagination(),
  AttendanceController.findAll,
);

attendanceRouter.get(
  "/:id",
  canManageAttendance.withAction("view"),
  identifier,
  AttendanceController.findById,
);

attendanceRouter.post(
  "/",
  canManageAttendance.withAction("edit"),
  validateRequest.body.withRules(CREATE_ATTENDANCE_RULES).middleware,
  AttendanceController.create,
);

attendanceRouter.put(
  "/:id",
  canManageAttendance.withAction("edit"),
  identifier,
  validateRequest.body
    .withRules(UPDATE_ATTENDANCE_RULES)
    .shouldHaveAtLeastOneValidProp("Informe detalhes ou produtos solicitados")
    .middleware,
  AttendanceController.update,
);

attendanceRouter.patch(
  "/:id/cancel",
  canManageAttendance.withAction("delete"),
  identifier,
  validateRequest.body.withRules(CANCEL_ATTENDANCE_RULES).middleware,
  AttendanceController.cancel,
);

export default attendanceRouter;
