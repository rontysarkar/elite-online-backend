import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import {
	ChangeCustomerStatusSchema,
	CreateCustomerAccountSchema,
	UpdateCustomerInfoSchema,
} from "./customer.validation";
import { CustomerController } from "./customer.controller";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN),
	validateRequest(CreateCustomerAccountSchema),
	CustomerController.createCustomerAccount,
);
router.patch(
	"/:customerId",
	auth(Role.ADMIN),
	validateRequest(UpdateCustomerInfoSchema),
	CustomerController.updateCustomerInfo,
);
router.get("/", auth(Role.ADMIN), CustomerController.getAllCustomers);
router.get(
	"/my-customers",
	auth(Role.COLLECTOR),
	CustomerController.getMyCustomers,
);
router.get(
	"/:customerId",
	auth(Role.ADMIN, Role.COLLECTOR),
	CustomerController.getCustomerById,
);

router.patch(
	"/status/:customerId",
	validateRequest(ChangeCustomerStatusSchema),
	auth(Role.ADMIN),
	CustomerController.changeCustomerStatus,
);

export const CustomerRoutes = router;
