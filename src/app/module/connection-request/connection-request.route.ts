import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import {
  CreateConnectionRequestSchema,
  RequestedEmailVerifySchema,
} from "./connection-request.validatoin";
import { ConnectionRequestController } from "./connection-request.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  validateRequest(CreateConnectionRequestSchema),
  ConnectionRequestController.createConnectionRequest,
);
router.post(
  "/email-verify",
  validateRequest(RequestedEmailVerifySchema),
  ConnectionRequestController.requestedEmailVerify,
);
router.post(
  "/:requestedId",auth(Role.ADMIN),
  ConnectionRequestController.acceptConnectionRequest,
);

router.get('/',auth(Role.ADMIN),ConnectionRequestController.getAllConnectionRequest);

export const CreateConnectionRequestRoutes = router;
