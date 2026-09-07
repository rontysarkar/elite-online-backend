import { Prisma } from "../../../generated/prisma/client";
import { BillStatus, CustomerStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from 'http-status'

function getLastDateOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0);
}

const generateMonthlyBills = async () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const dueDate = getLastDateOfMonth(year, month);

  // Step 1: Mark previous unpaid bills as overdue
  await prisma.bill.updateMany({
    where: {
      status: BillStatus.UNPAID,
      dueDate: {
        lt: now,
      },
    },
    data: {
      status: BillStatus.OVERDUE,
    },
  });

  // Step 2: Get all active customers
  const activeCustomers = await prisma.customer.findMany({
    where: {
      status: CustomerStatus.ACTIVE,
    },
    include: {
      package: true,
    },
  });

  let created = 0;
  let skipped = 0;

  // Step 3: Generate bill for each active customer
  for (const customer of activeCustomers) {
    try {
      await prisma.bill.create({
        data: {
          customerId: customer.id,
          month,
          year,
          amount: customer.package.price,
          dueDate,
          status: BillStatus.UNPAID,
        },
      });

      created++;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        skipped++;
        continue;
      }

      throw error;
    }
  }

  return {
    created,
    skipped,
    month,
    year,
  };
};

const generateCustomerBill = async (customerId:string) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const dueDate = getLastDateOfMonth(year, month);

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      package: true,
    },
  });

  if(!customer){
    throw new AppError(httpStatus.NOT_FOUND,"Customer Not Found")
  }

  const bill = await prisma.bill.create({
    data:{
        amount:customer.package.price,
        month,
        year,
        dueDate,
        customerId:customer.id,
        status:BillStatus.UNPAID
    }
  })

  return bill;
};

export const BillServices = {
  generateMonthlyBills,
  generateCustomerBill
};
