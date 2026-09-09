// import { Router } from "express";
// import { AdminController } from "./admin.controller";
// import { validateRequest } from "../../middleware/validatedRequest";
// import { CreateCollectorAccountSchema, CreateCustomerAccountSchema } from "./admin.validation";
// import { auth } from "../../middleware/checkAuth";
// import { Role } from "../../../generated/prisma/enums";


// const router = Router();

// router.post("/create-customer",auth(Role.ADMIN),validateRequest(CreateCustomerAccountSchema), AdminController.createCustomerAccount);
// router.post('/create-collector',auth(Role.ADMIN),validateRequest(CreateCollectorAccountSchema),AdminController.createCollectorAccount)
// export const AdminRoutes = router;
