import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "../../../generated/prisma/client";
import { IQuery, IRequestUser } from "../../interface";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";

const getAdminReport = async (query: IQuery) => {
  const { month, year, collectorId } = query;

  const where: Prisma.BillWhereInput = {};

  if (year) {
    const yearNumber = Number(year);

    if (!Number.isInteger(yearNumber) || yearNumber < 2000) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid year");
    }
    where.year = yearNumber;
  }

  if (month) {
    const monthNumber = Number(month);

    if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Month must be between 1 and 12",
      );
    }

    where.month = monthNumber;
  }

  if (collectorId) {
    where.customer = {
      area: {
        collectorId,
      },
    };
  }

  const billReport = await prisma.bill.groupBy({
    by: ["status"],
    where,

    _count: {
      id: true,
    },

    _sum: {
      amount: true,
    },
  });

  const paymentMethodReport = await prisma.payment.groupBy({
    by: ["method"],

    where: {
      bill: where,
      status: PaymentStatus.SUCCESS,
    },

    _count: {
      id: true,
    },

    _sum: {
      amount: true,
    },
  });

  const paidReport = billReport.find((item) => item.status === "PAID");

  const unpaidReport = billReport.find((item) => item.status === "UNPAID");

  const overdueReport = billReport.find((item) => item.status === "OVERDUE");

  const totalBills = billReport.reduce(
    (total, item) => total + item._count.id,
    0,
  );

  const totalBillAmount = billReport.reduce(
    (total, item) => total + Number(item._sum.amount ?? 0),
    0,
  );

  const paidBills = paidReport?._count.id ?? 0;

  const paidAmount = Number(paidReport?._sum.amount ?? 0);

  const unpaidBills = unpaidReport?._count.id ?? 0;

  const unpaidAmount = Number(unpaidReport?._sum.amount ?? 0);

  const overdueBills = overdueReport?._count.id ?? 0;

  const overdueAmount = Number(overdueReport?._sum.amount ?? 0);

  const cashReport = paymentMethodReport.find(
    (item) => item.method === PaymentMethod.CASH_COLLECTOR,
  );

  const bkashReport = paymentMethodReport.find(
    (item) => item.method === PaymentMethod.BKASH,
  );

  const cashCollectedBills = cashReport?._count.id ?? 0;

  const cashCollectedAmount = Number(cashReport?._sum.amount ?? 0);

  const bkashPaidBills = bkashReport?._count.id ?? 0;

  const bkashPaidAmount = Number(bkashReport?._sum.amount ?? 0);

  const collectionRate =
    totalBillAmount > 0
      ? Number(((paidAmount / totalBillAmount) * 100).toFixed(2))
      : 0;

  return {
    totalBills,
    totalBillAmount,

    paidBills,
    paidAmount,
    paidMethod: {
      cashCollectedBills,
      cashCollectedAmount,

      bkashPaidBills,
      bkashPaidAmount,
    },

    unpaidBills,
    unpaidAmount,

    overdueBills,
    overdueAmount,
    collectionRate,
  };
};

const getCollectorReport = async (query: IQuery, user: IRequestUser) => {
  const { month, year } = query;

  const where: Prisma.BillWhereInput = {};

  if (year) {
    const yearNumber = Number(year);

    if (!Number.isInteger(yearNumber) || yearNumber < 2000) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid year");
    }
    where.year = yearNumber;
  }

  if (month) {
    const monthNumber = Number(month);

    if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Month must be between 1 and 12",
      );
    }

    where.month = monthNumber;
  }

  where.customer = {
    area: {
      collectorId: user?.userId,
    },
  };

  const billReport = await prisma.bill.groupBy({
    by: ["status"],
    where,

    _count: {
      id: true,
    },

    _sum: {
      amount: true,
    },
  });

  const paymentMethodReport = await prisma.payment.groupBy({
    by: ["method"],

    where: {
      bill: where,
      status: PaymentStatus.SUCCESS,
    },

    _count: {
      id: true,
    },

    _sum: {
      amount: true,
    },
  });

  const paidReport = billReport.find((item) => item.status === "PAID");

  const unpaidReport = billReport.find((item) => item.status === "UNPAID");

  const overdueReport = billReport.find((item) => item.status === "OVERDUE");

  const totalBills = billReport.reduce(
    (total, item) => total + item._count.id,
    0,
  );

  const totalBillAmount = billReport.reduce(
    (total, item) => total + Number(item._sum.amount ?? 0),
    0,
  );

  const paidBills = paidReport?._count.id ?? 0;

  const paidAmount = Number(paidReport?._sum.amount ?? 0);

  const unpaidBills = unpaidReport?._count.id ?? 0;

  const unpaidAmount = Number(unpaidReport?._sum.amount ?? 0);

  const overdueBills = overdueReport?._count.id ?? 0;

  const overdueAmount = Number(overdueReport?._sum.amount ?? 0);

  const cashReport = paymentMethodReport.find(
    (item) => item.method === PaymentMethod.CASH_COLLECTOR,
  );

  const bkashReport = paymentMethodReport.find(
    (item) => item.method === PaymentMethod.BKASH,
  );

  const cashCollectedBills = cashReport?._count.id ?? 0;

  const cashCollectedAmount = Number(cashReport?._sum.amount ?? 0);

  const bkashPaidBills = bkashReport?._count.id ?? 0;

  const bkashPaidAmount = Number(bkashReport?._sum.amount ?? 0);

  const collectionRate =
    totalBillAmount > 0
      ? Number(((paidAmount / totalBillAmount) * 100).toFixed(2))
      : 0;

  return {
    totalBills,
    totalBillAmount,

    paidBills,
    paidAmount,
    paidMethod: {
      cashCollectedBills,
      cashCollectedAmount,

      bkashPaidBills,
      bkashPaidAmount,
    },

    unpaidBills,
    unpaidAmount,

    overdueBills,
    overdueAmount,
    collectionRate,
  };
};

export const ReportServices = {
  getAdminReport,
  getCollectorReport,
};
