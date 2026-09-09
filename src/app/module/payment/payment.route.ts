import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreatePaymentByCollectorSchema } from "./payment.validation";

const router = Router();

router.post('/payment-by-collector',validateRequest(CreatePaymentByCollectorSchema),auth(Role.COLLECTOR),PaymentController.createPaymentByCollector);
router.post('/payment-by-customer',validateRequest(CreatePaymentByCollectorSchema),auth(Role.CUSTOMER),PaymentController.createPaymentByCustomer)
router.get('/bkash-callback',PaymentController.bkashPaymentCallback);
export const PaymentRoutes = router;