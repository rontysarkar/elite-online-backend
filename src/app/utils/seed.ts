import httpStatus from "http-status";

import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });

    if (isAdminExist) {
      console.log("Admin Already Exist");
      return;
    }

    const adminName = config.admin_name;
    const adminEmail = config.admin_email;
    const adminPhone = config.admin_phone;
    const adminPassword = config.admin_password;

    if (!adminName || !adminEmail || !adminPhone || !adminPassword) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Seeding Error: admin info messing",
      );
    }

    const hashPassword = await bcrypt.hash(
      adminPassword,
      Number(config.bcrypt_salt_rounds),
    );

    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        role: Role.ADMIN,
        password: hashPassword,
      },
    });

    console.log("admin created :", admin);
  } catch (error) {
    console.log("Error Seeding admin:", error);
    await prisma.user.delete({
      where: {
        email: config.admin_email,
      },
    });
  }
};

export const seedCollector = async () => {
  try {
    const isCollectorExist = await prisma.user.findFirst({
      where: {
        role: Role.COLLECTOR,
      },
    });

    if (isCollectorExist) {
      console.log("Collector Already Exists");
      return;
    }

    const collectorName = config.collector_name;
    const collectorEmail = config.collector_email;
    const collectorPhone = config.collector_phone;
    const collectorPassword = config.collector_password;

    if (
      !collectorName ||
      !collectorEmail ||
      !collectorPhone ||
      !collectorPassword
    ) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Seeding Collector Info Messing",
      );
    }

    const hashPassword = await bcrypt.hash(
      collectorPassword,
      Number(config.bcrypt_salt_rounds),
    );

    const collector = await prisma.user.create({
      data: {
        name: collectorName,
        email: collectorEmail,
        phone: collectorPhone,
        password: hashPassword,
        role: Role.COLLECTOR,
      },
    });

    console.log("Seeding Created Collector : ", collector);
  } catch (error) {
    console.log("Error Seeding Collector : ", error);
    await prisma.user.delete({
      where: { email: config.collector_email },
    });
  }
};
