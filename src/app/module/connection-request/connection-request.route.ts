import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreateConnectionRequestSchema, RequestedEmailVerifySchema } from "./connection-request.validatoin";
import { ConnectionRequestController } from "./connection-request.controller";

const router = Router();

router.post('/create-connection-request',validateRequest(CreateConnectionRequestSchema),ConnectionRequestController.createConnectionRequest)
router.post('/requested-email-verify',validateRequest(RequestedEmailVerifySchema),ConnectionRequestController.requestedEmailVerify)

export const CreateConnectionRequestRoutes = router;