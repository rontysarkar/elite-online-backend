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
  "/create-connection-request",
  validateRequest(CreateConnectionRequestSchema),
  ConnectionRequestController.createConnectionRequest,
);
router.post(
  "/requested-email-verify",
  validateRequest(RequestedEmailVerifySchema),
  ConnectionRequestController.requestedEmailVerify,
);
router.post(
  "/accept-connection-request/:requestedId",auth(Role.ADMIN),
  ConnectionRequestController.acceptConnectionRequest,
);

export const CreateConnectionRequestRoutes = router;
