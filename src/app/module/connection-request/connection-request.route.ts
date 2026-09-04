import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreateConnectionRequestSchema } from "./connection-request.validatoin";
import { ConnectionRequestController } from "./connection-request.controller";

const router = Router();

router.post('/create-connection-request',validateRequest(CreateConnectionRequestSchema),ConnectionRequestController.createConnectionRequest)


export const CreateConnectionRequestRoutes = router;