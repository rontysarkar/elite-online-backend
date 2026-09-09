import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { CreateCollectorAccountSchema } from "./collector.validation";
import { CollectorController } from "./collector.controller";

const router = Router();

router.post(
  "/create-collector",
  auth(Role.ADMIN),
  validateRequest(CreateCollectorAccountSchema),
  CollectorController.createCollectorAccount,
);
export const CollectorRoutes = router;
