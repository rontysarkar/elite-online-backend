import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { BillController } from "./bill.controller";

const router = Router();

// admin

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

router.get("/bills", auth(Role.ADMIN), BillController.getBillsByAdmin);

// customer
router.get("/my-bills", auth(Role.CUSTOMER), BillController.getMyBills);

export const BillRoutes = router;
