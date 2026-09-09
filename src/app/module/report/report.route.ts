import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { ReportController } from "./report.controller";

const router = Router();

router.get(
  "/admin",
  auth(Role.ADMIN),
  ReportController.getAdminReport,
);
router.get(
  "/collector",
  auth(Role.COLLECTOR),
  ReportController.getCollectorReport,
);

export const ReportRoutes = router;
