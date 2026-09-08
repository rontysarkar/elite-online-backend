import {
  BillStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

const createPaymentByCollector = async (billId: string, user: IRequestUser) => {
  const bill = await prisma.bill.findUnique({
    where: {
      id: billId,
    },
    include: {
      customer: {
        include: {
          area: true,
        },
      },
      payment: true,
    },
  });

  if (!bill) {
    throw new AppError(httpStatus.NOT_FOUND, "Bill not found");
  }

  if (bill?.customer?.area?.collectorId !== user?.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to collect or pay this bills",
    );
  }

  if (bill.status === "PAID") {
    throw new AppError(httpStatus.CONFLICT, "This Bill Already Paid");
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    const payment = bill.payment
      ? await tx.payment.update({
          where: {
            billId: bill.id,
          },
          data: {
            amount: bill.amount,
            method: PaymentMethod.CASH_COLLECTOR,
            status: PaymentStatus.SUCCESS,
            collectorId: bill.customer.area.collectorId,
            paidAt: new Date(),
          },
        })
      : await tx.payment.create({
          data: {
            amount: bill.amount,
            method: PaymentMethod.CASH_COLLECTOR,
            customerId: bill.customerId,
            billId: bill.id,
            status: PaymentStatus.SUCCESS,
            collectorId: bill.customer.area.collectorId,
            paidAt: new Date(),
          },
        });

    await tx.bill.update({
      where: {
        id: billId,
      },
      data: {
        status: BillStatus.PAID,
      },
    });

    return payment;
  });

  return transactionResult;
};

export const PaymentServices = {
  createPaymentByCollector,
};
