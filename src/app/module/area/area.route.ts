import { Router } from "express";
import { AreaController } from "./area.controller";
import { validateRequest } from "../../middleware/validatedRequest";
import {
	CreateAreaPayloadSchema,
	UpdateAreaPayloadSchema,
} from "./area.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
	"/",
	validateRequest(CreateAreaPayloadSchema),
	auth(Role.ADMIN),
	AreaController.createArea,
);
router.patch(
	"/:areaId",
	validateRequest(UpdateAreaPayloadSchema),
	auth(Role.ADMIN),
	AreaController.updatedAreaCollector,
);
router.get("/", AreaController.getAllArea);
router.get("/my-area", auth(Role.COLLECTOR), AreaController.getCollectorArea);
router.get("/:areaId", AreaController.getAreaById);

export const AreaRoutes = router;
