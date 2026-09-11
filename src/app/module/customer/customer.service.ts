import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import {
  ICreateCustomerAccountPayload,
  IUpdateCustomerInfoPayload,
} from "./customer.interface";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import httpStatus from "http-status";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { transporter } from "../../lib/nodemailer";
import { Prisma } from "../../../generated/prisma/client";
import { IQuery, IRequestUser } from "../../interface";
import { buildQuery } from "../../utils/queryBuilder";

const createCustomerAccount = async (
  payload: ICreateCustomerAccountPayload,
) => {
  const { name, email, phone, address, areaId, packageId } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User Already Exist");
  }

  // const password = crypto.randomBytes(8).toString("hex");
  const password = "12345678"
  
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const customer = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashPassword,
      role: Role.CUSTOMER,
      customer: {
        create: {
          name,
          address,
          areaId,
          packageId,
        },
      },
    },
    include: {
      customer: true,
    },

    omit: {
      password: true,
    },
  });

  // const html = await ejs.renderFile(
  //   path.join(process.cwd(), "src/app/templates/account-created.ejs"),
  //   {
  //     userName: name,
  //     userEmail: email,
  //     tempPassword: password,
  //   },
  // );

  // await transporter.sendMail({
  //   from: config.smtp_sender_email,
  //   to: email,
  //   subject: "Your Elite Online Account Has Been Created!",
  //   html: html,
  // });

  return customer;
};

const getAllCustomers = async (query: IQuery) => {
  const { limit, skip, page, sortBy, sortOrder } = buildQuery(query);

  const andConditions: Prisma.CustomerWhereInput[] = [];

  // Search
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            phone: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Area filter
  if (query.areaId) {
    andConditions.push({
      areaId: query.areaId,
    });
  }

  const where: Prisma.CustomerWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const customers = await prisma.customer.findMany({
    where,
    skip,
    take: limit,

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      area: {
        select: {
          id: true,
          name: true,

          collector: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.customer.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },

    data: customers,
  };
};


const getMyCustomers = async (query: IQuery,user:IRequestUser) => {
  const { limit, skip, page, sortBy, sortOrder } = buildQuery(query);

  const andConditions: Prisma.CustomerWhereInput[] = [
    {
      area:{
        collectorId:user.userId
      }
    }
  ];

  // Search
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            phone: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Area filter
  if (query.areaId) {
    andConditions.push({
      areaId: query.areaId,
    });
  }

  const where: Prisma.CustomerWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const customers = await prisma.customer.findMany({
    where,
    skip,
    take: limit,

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      area: {
        select: {
          id: true,
          name: true,

          collector: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.customer.count({
    where,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },

    data: customers,
  };
};

const getCustomerById = async (customerId: string) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      area: {
        select: {
          id: true,
          name: true,

          collector: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      package: true,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer Not Found");
  }

  return customer;
};

const updateCustomerInfo = async (
  customerId: string,
  payload: IUpdateCustomerInfoPayload,
) => {
  const { address, areaId, packageId, status } = payload;

  const isCustomerExist = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!isCustomerExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Customer Not Found",
    );
  }

  const updateData: Prisma.CustomerUpdateInput = {};

  if (address !== undefined) {
    updateData.address = address;
  }

  if (areaId !== undefined) {
    updateData.area = {
      connect: {
        id: areaId,
      },
    };
  }

  if (packageId !== undefined) {
    updateData.package = {
      connect: {
        id: packageId,
      },
    };
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  const updatedCustomer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: updateData,

    include: {
      area: true,
      package: true,
    },
  });

  return updatedCustomer;
};

export const CustomerServices = {
  createCustomerAccount,
  getAllCustomers,
  getMyCustomers,
  getCustomerById,
  updateCustomerInfo,
};
