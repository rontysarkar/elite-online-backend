import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreatePaymentByCollectorSchema } from "./payment.validation";

const router = Router();

router.post(
	"/collector",
	validateRequest(CreatePaymentByCollectorSchema),
	auth(Role.COLLECTOR),
	PaymentController.createPaymentByCollector,
);
router.post(
	"/bkash",
	validateRequest(CreatePaymentByCollectorSchema),
	auth(Role.CUSTOMER),
	PaymentController.createPaymentByCustomer,
);
router.get("/bkash-callback", PaymentController.bkashPaymentCallback);
router.get(
	"/my-payments",
	auth(Role.CUSTOMER),
	PaymentController.getMyPayments,
);
export const PaymentRoutes = router;
