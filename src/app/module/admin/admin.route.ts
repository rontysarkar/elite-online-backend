import { Router } from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validatedRequest";
import { CreateCollectorAccountSchema, CreateCustomerAccountSchema } from "./admin.validation";


const route = Router();

route.post("/create-customer",validateRequest(CreateCustomerAccountSchema), AdminController.createCustomerAccount);
route.post('/create-collector',validateRequest(CreateCollectorAccountSchema),AdminController.createCollectorAccount)

export const AdminRoutes = route;
