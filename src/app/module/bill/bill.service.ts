import { Prisma } from "../../../generated/prisma/client";
import { BillStatus, CustomerStatus } from "../../../generated/prisma/enums";
import { IQuery, IRequestUser } from "../../interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { buildQuery } from "../../utils/queryBuilder";
import { BillWhereInput } from "../../../generated/prisma/models";

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

const generateCustomerBill = async (customerId: string) => {
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

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer Not Found");
  }

  const bill = await prisma.bill.create({
    data: {
      amount: customer.package.price,
      month,
      year,
      dueDate,
      customerId: customer.id,
      status: BillStatus.UNPAID,
    },
  });

  return bill;
};

const getMyBills = async (query: IQuery, userId: string) => {
  const andCondition: BillWhereInput[] = [
    {
      customer: {
        userId,
      },
    },
  ];

  if (query.status) {
    andCondition.push({
      status: query?.status,
    });
  }

  const bills = await prisma.bill.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: [
      {
        year: "desc",
      },
      {
        month: "desc",
      },
    ],
  });

  return bills;
};

const getBillsByAdmin = async (query: IQuery) => {
  const { limit, page, skip, sortBy, sortOrder } = buildQuery(query);

  const andCondition: BillWhereInput[] = [];

  // searchTerm
  if(query.searchTerm){
    andCondition.push({
      OR:[
        {
          customer:{
            name:{
              contains:query.searchTerm,
              mode:'insensitive'
            }
          }
        },
        {
          customer:{
            address:{
              contains:query.searchTerm,
              mode:'insensitive'
            }
          }
        },
        {
          customer:{
            area:{
              name:{
                contains:query.searchTerm,
                mode:'insensitive'
              }
            }
          }
        }
   
      ]
    })
  }

  // Filters
  if (query.status) {
    andCondition.push({
      status: query.status,
    });
  }

  if (query.month) {
    andCondition.push({
      month: Number(query.month),
    });
  }

  if (query.year) {
    andCondition.push({
      year: Number(query.year),
    });
  }

  if(query.areaId){
    andCondition.push({
      customer:{
        areaId:query.areaId
      }
    })
  }

  if (query.collectorId) {
    andCondition.push({
      customer: {
        area: {
          collectorId: query?.collectorId,
        },
      },
    });
  }

  const bills = await prisma.bill.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: {
        select: {
          id: true,
          address: true,
          user: {
            select: {
              name: true,
            },
          },
          package: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.bill.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    bills,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getBillsByCollectorId = async (query: IQuery, user: IRequestUser) => {
  const { limit, page, skip, sortBy, sortOrder } = buildQuery(query);

  const andCondition: BillWhereInput[] = [
    {
      customer: {
        area: {
          collectorId: user?.userId,
        },
      },
    },
  ];

  // searchTerm
  if(query.searchTerm){
    andCondition.push({
      OR:[
        {
          customer:{
            name:{
              contains:query.searchTerm,
              mode:'insensitive'
            }
          }
        },
        {
          customer:{
            address:{
              contains:query.searchTerm,
              mode:'insensitive'
            }
          }
        },
        {
          customer:{
            area:{
              name:{
                contains:query.searchTerm,
                mode:'insensitive'
              }
            }
          }
        }
   
      ]
    })
  }

  // Filters
  if (query.status) {
    andCondition.push({
      status: query.status,
    });
  }

  if (query.month) {
    andCondition.push({
      month: Number(query.month),
    });
  }

  if (query.year) {
    andCondition.push({
      year: Number(query.year),
    });
  }

  

  const bills = await prisma.bill.findMany({
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      customer: {
        select: {
          id: true,
          address: true,
          user: {
            select: {
              name: true,
            },
          },
          package: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.bill.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    bills,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getBillById = async (billId:string)=>{

  const bill = await prisma.bill.findUnique({
    where:{
      id:billId
    },
    include:{
      customer:{
        include:{
          package:true,
          user:true,
          payment:true
        }
      }
    }
  })

  if(!bill){
    throw new AppError(httpStatus.NOT_FOUND,"Bill Not Found")
  }

  return bill;
}

export const BillServices = {
  generateMonthlyBills,
  generateCustomerBill,
  getMyBills,
  getBillsByAdmin,
  getBillsByCollectorId,
  getBillById,
};
