import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { CreateCollectorAccountSchema } from "./collector.validation";
import { CollectorController } from "./collector.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(CreateCollectorAccountSchema),
  CollectorController.createCollectorAccount,
);

router.get("/",auth(Role.ADMIN),CollectorController.getAllCollector)
export const CollectorRoutes = router;
