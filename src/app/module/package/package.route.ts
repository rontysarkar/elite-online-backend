import { Router } from "express";
import { PackageController } from "./package.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN), PackageController.createPackage);
router.get("/", PackageController.getAllPackage);

export const PackageRoutes = router;
