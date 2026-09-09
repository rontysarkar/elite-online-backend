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

router.get(
  "/bill/:billId",
  auth(Role.ADMIN, Role.COLLECTOR),
  BillController.getBillById,
);

router.get(
  "/bills/collector",
  auth(Role.COLLECTOR),
  BillController.getBillsByCollectorId,
);

router.get("/my-bills", auth(Role.CUSTOMER), BillController.getMyBills);

export const BillRoutes = router;
