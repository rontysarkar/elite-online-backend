import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import config from "../../config";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import { transporter } from "../../lib/nodemailer";
import { ICreateCollectorAccountPayload } from "./collector.interface";

const createCollectorAccount = async (
  payload: ICreateCollectorAccountPayload,
) => {
  const { name, email, phone } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User Already Exist");
  }

  const password = crypto.randomBytes(8).toString("hex");
  // const password = "12345678";

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
      role: Role.COLLECTOR,
    },
    omit: {
      password: true,
    },
  });

  const html = await ejs.renderFile(
    path.join(process.cwd(), "src/app/templates/account-created.ejs"),
    {
      userName: name,
      userEmail: email,
      tempPassword: password,
    },
  );

  await transporter.sendMail({
    from: config.smtp_sender_email,
    to: email,
    subject: "Your Elite Online Account Has Been Created!",
    html: html,
  });

  return customer;
};

const getAllCollector = async () => {
  const collectors = await prisma.user.findMany({
    where: {
      role: Role.COLLECTOR,
      isDeleted: false,
    },
    omit: {
      password: true,
      isDeleted: true,
      updatedAt: true,
    },
    include: {
      _count: {
        select: {
          area: true,
        },
      },
      area: {
        select: {
          _count: {
            select: {
              customer: true,
            },
          },
          name: true,
        },
      },
    },
  });

  if (!collectors || collectors.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Collectors Not Found");
  }

  const flattenedCollectors = collectors.map((collector) => {
    const totalCustomers = collector.area.reduce(
      (sum, item) => sum + (item._count?.customer || 0), 
      0
    );

    const areaNames = collector.area.map((item) => item.name);

    const { area, _count, ...userData } = collector;

    return {
      ...userData,
      totalAreas: _count?.area || 0,
      totalCustomers: totalCustomers,
      areas: areaNames,
    };
  });

  return flattenedCollectors;
};




export const CollectorServices = {
  createCollectorAccount,
  getAllCollector,
};
