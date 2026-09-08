import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreatePaymentByCollectorSchema } from "./payment.validation";

const router = Router();

router.post('/payment-by-collector',validateRequest(CreatePaymentByCollectorSchema),auth(Role.COLLECTOR),PaymentController.createPaymentByCollector);


export const PaymentRoutes = router;