import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { BillController } from "./bill.controller";

const router = Router();

router.post(
  "/generate-monthly-bills",
  auth(Role.ADMIN),
  BillController.generateMonthlyBills,
);
router.post(
  "/generate-customer-bill/:customerId",
  auth(Role.ADMIN),
  BillController.generateCustomerBill,
);

export const BillRoutes = router;
