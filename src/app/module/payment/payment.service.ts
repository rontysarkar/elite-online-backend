import {
  BillStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { IRequestUser } from "../../interface";
import { getBkashIdToken } from "../../lib/bkash";
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

const createPaymentByCustomer = async (billId: string, user: IRequestUser) => {
  const bill = await prisma.bill.findUnique({
    where: {
      id: billId,
    },
    include: {
      customer: true,
      payment: true,
    },
  });

  if (!bill) {
    throw new AppError(httpStatus.NOT_FOUND, "Bill not found");
  }

  if (bill.customer.userId !== user.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to pay this bills",
    );
  }

  if (bill.status === "PAID") {
    throw new AppError(httpStatus.CONFLICT, "This Bill Already Paid");
  }

  const bkashIdToken = await getBkashIdToken();

  if (!bkashIdToken) {
    throw new Error("Bkash Id Token Messing");
  }

  const createPaymentResponse = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: bkashIdToken,
        "x-app-key": config.bkash_app_key,
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: user.email,
        callbackURL: `${config.bkash_callback_url}/payments/bkash-callback`,
        amount: String(bill.amount),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: bill?.id,
      }),
    },
  );

  const createPaymentResult = await createPaymentResponse.json();

  // ৩. bKash থেকে কোনো ভুল বা statusCode আসলে এখানেই আটকে দিন
  if (!createPaymentResult || createPaymentResult.statusCode !== "0000") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      createPaymentResult.statusMessage || "bKash Payment Creation Failed"
    );
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    const payment = bill.payment
      ? await tx.payment.update({
          where: {
            billId: bill.id,
          },
          data: {
            amount: bill.amount,
            method: PaymentMethod.BKASH,
            paymentId: createPaymentResult?.paymentID,
            gatewayResponse: createPaymentResult,
            merchantInvoiceNumber: createPaymentResult?.merchantInvoiceNumber,
            status: PaymentStatus.PENDING,
          },
        })
      : await tx.payment.create({
          data: {
            billId: bill.id,
            customerId: bill.customerId,
            amount: bill.amount,
            method: PaymentMethod.BKASH,
            paymentId: createPaymentResult?.paymentID,
            gatewayResponse: createPaymentResult,
            merchantInvoiceNumber: createPaymentResult?.merchantInvoiceNumber,
            status: PaymentStatus.PENDING,
          },
        });

    return payment;
  });

  return {
    bkashUrl: createPaymentResult?.bkashURL,
  };
};

const bkashPaymentCallback = async (query: Record<string, any>) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const bkashIdToken = await getBkashIdToken();

    if (!bkashIdToken) {
      throw new AppError(httpStatus.NOT_FOUND, "Bkash Id Token Messing");
    }
    const { paymentID, status } = query;
    if (!paymentID) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment Id Messing");
    }
    if (!status) {
      throw new AppError(httpStatus.NOT_FOUND, "Status Messing");
    }

    const executePaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: bkashIdToken,
          "x-app-key": config.bkash_app_key,
        },
        body: JSON.stringify({
          paymentID: paymentID,
        }),
      },
    );

    const executePaymentResult = await executePaymentResponse.json();

    if (status === "success") {
       await tx.bill.update({
        where: {
          id: executePaymentResult?.merchantInvoiceNumber,
        },
        data: {
          status: BillStatus.PAID,
        },
      });

      await tx.payment.update({
        where: {
          paymentId:paymentID,
        },
        data: {
          gatewayResponse: executePaymentResult,
          status: PaymentStatus.SUCCESS,
          trxId: executePaymentResult?.trxID,
          paidAt: executePaymentResult?.paymentExecuteTime,
        },
      });

      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-bill?status=success`,
      };
    } else if (status === "failure") {
      await tx.payment.update({
        where: {
          paymentId: paymentID,
        },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: executePaymentResult,
        },
      });

      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-bills?status=failure`,
      };
    } else if (status === "cancel") {
      await tx.payment.update({
        where: {
          paymentId: paymentID,
        },
        data: {
          status: PaymentStatus.CANCELLED,
          gatewayResponse: executePaymentResult,
        },
      });
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-bills?status=cancel`,
      };
    } else {
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-bills?error=payment-failed`,
      };
    }
  });

  return transactionResult;
};

const getMyPayments = async(user:IRequestUser) =>{

  const payments = await prisma.payment.findMany({
    where:{
      customer:{
        userId:user.userId
      }
    },
    include:{
      bill:true
    }
  })

  return payments;
}

export const PaymentServices = {
  createPaymentByCollector,
  createPaymentByCustomer,
  bkashPaymentCallback,
  getMyPayments,
};
