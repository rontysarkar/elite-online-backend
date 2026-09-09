import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validatedRequest";
import { ChangePasswordPayloadSchema, ForgotPasswordPayloadSchema, SetNewPasswordPayloadSchema } from "./auth.validation";

const router = Router();

router.post("/login", AuthController.loginUser);
router.patch('/change-password',validateRequest(ChangePasswordPayloadSchema),auth(Role.ADMIN,Role.COLLECTOR,Role.CUSTOMER),AuthController.changePassword)
router.post('/forgot-password',validateRequest(ForgotPasswordPayloadSchema),AuthController.forgotPassword)
router.post('/reset-password',validateRequest(SetNewPasswordPayloadSchema),AuthController.setNewPassword)
export const AuthRoutes = router;
