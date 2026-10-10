import { Router } from "express";
import identifier from "../middlewares/validator/id.js";
import { pagination } from "../middlewares/validator/pagination.js";
import { validateRequest } from "../middlewares/validator/validator.js";
import requiresPermission from "../middlewares/permission.js";
import {
  CREATE_BILL_RULES,
  FILTER_BILLS_RULES,
  EXTEND_BILL_RULES,
  CANCEL_BILL_RULES,
  CANCEL_AND_COPY_BILL_RULES,
} from "../validators/bill.validator.js";
import BillController from "../controllers/Bill.controller.js";

const billsRouter = Router();
const canManageResource = requiresPermission.forResource("bill");

billsRouter.get(
  "/",
  canManageResource.withAction("list"),
  pagination(FILTER_BILLS_RULES),
  BillController.findAll,
);

billsRouter.get(
  "/:id",
  canManageResource.withAction("view"),
  identifier,
  BillController.findById,
);

billsRouter.post(
  "/",
  canManageResource.withAction("create"),
  validateRequest.body.withRules(CREATE_BILL_RULES).middleware,
  BillController.create,
);

billsRouter.patch(
  "/:id",
  canManageResource.withAction("pay"),
  identifier,
  BillController.pay,
);

billsRouter.patch(
  "/:id/extend",
  canManageResource.withAction("extend"),
  identifier,
  validateRequest.body.withRules(EXTEND_BILL_RULES).middleware,
  BillController.extend,
);

billsRouter.patch(
  "/:id/cancel",
  canManageResource.withAction("delete"),
  identifier,
  validateRequest.body.withRules(CANCEL_BILL_RULES).middleware,
  BillController.cancel,
);

billsRouter.post(
  "/:id/cancel-and-copy",
  canManageResource.withAction("delete"),
  identifier,
  validateRequest.body.withRules(CANCEL_AND_COPY_BILL_RULES).middleware,
  BillController.cancelAndCopy,
);

export default billsRouter;
