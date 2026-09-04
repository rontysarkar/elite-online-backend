import { Router } from "express";
import { AreaController } from "./area.controller";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreateAreaPayloadSchema } from "./area.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post('/create-area',validateRequest(CreateAreaPayloadSchema),AreaController.createArea);
router.get('/',AreaController.getAllArea);
router.get('/collector-area',auth(Role.COLLECTOR),AreaController.getCollectorArea)

export const AreaRoutes = router;