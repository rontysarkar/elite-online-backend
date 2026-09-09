import { Router } from "express";
import { validateRequest } from "../../middleware/validatedRequest";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { CreateCustomerAccountSchema, UpdateCustomerInfoSchema } from "./customer.validation";
import { CustomerController } from "./customer.controller";


const router = Router();

router.post("/create-customer",auth(Role.ADMIN),validateRequest(CreateCustomerAccountSchema), CustomerController.createCustomerAccount);
router.get('/',auth(Role.ADMIN),CustomerController.getAllCustomers);
router.get('/my-customers',auth(Role.COLLECTOR),CustomerController.getMyCustomers);
router.get('/:customerId',auth(Role.ADMIN),CustomerController.getCustomerById);
router.patch('/:customerId',auth(Role.ADMIN),validateRequest(UpdateCustomerInfoSchema),CustomerController.updateCustomerInfo)


export const CustomerRoutes = router;
