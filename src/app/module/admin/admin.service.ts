// import bcrypt from "bcryptjs";
// import { prisma } from "../../lib/prisma";
// import { AppError } from "../../utils/AppError";
// import httpStatus from "http-status";
// import { Role } from "../../../generated/prisma/enums";
// import config from "../../config";
// import crypto from "crypto";
// import ejs from "ejs";
// import path from "path";
// import { transporter } from "../../lib/nodemailer";
// import { ICreateCollectorAccountPayload, ICreateCustomerAccountPayload } from "./admin.interface";

// const createCustomerAccount = async (payload: ICreateCustomerAccountPayload) => {
//   const { name, email, phone, address, areaId, packageId } = payload;

//   const isUserExist = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (isUserExist) {
//     throw new AppError(httpStatus.CONFLICT, "User Already Exist");
//   }

//   const password = crypto.randomBytes(8).toString("hex");
//   // const password = "customer123"
//   const hashPassword = await bcrypt.hash(
//     password,
//     Number(config.bcrypt_salt_rounds),
//   );

//   const customer = await prisma.user.create({
//     data: {
//       name,
//       email,
//       phone,
//       password: hashPassword,
//       role: Role.CUSTOMER,
//       customer: {
//         create: {
//           name,
//           address,
//           areaId,
//           packageId,
//         },
//       },
//     },
//     include: {
//       customer: true,
//     },

//     omit: {
//       password: true,
//     },
//   });

//   const html = await ejs.renderFile(
//     path.join(process.cwd(), "src/app/templates/account-created.ejs"),
//     {
//       userName: name,
//       userEmail: email,
//       tempPassword: password,
//     },
//   );

//   await transporter.sendMail({
//     from: config.smtp_sender_email,
//     to: email,
//     subject: "Your Elite Online Account Has Been Created!",
//     html: html,
//   });

//   return customer;
// };

// const createCollectorAccount = async (payload: ICreateCollectorAccountPayload) => {
//   const { name, email, phone} = payload;

//   const isUserExist = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (isUserExist) {
//     throw new AppError(httpStatus.CONFLICT, "User Already Exist");
//   }

//   const password = crypto.randomBytes(8).toString("hex");
//   const hashPassword = await bcrypt.hash(
//     password,
//     Number(config.bcrypt_salt_rounds),
//   );

//   const customer = await prisma.user.create({
//     data: {
//       name,
//       email,
//       phone,
//       password: hashPassword,
//       role: Role.COLLECTOR,
//     },
//     omit: {
//       password: true,
//     },
//   });

//   const html = await ejs.renderFile(
//     path.join(process.cwd(), "src/app/templates/account-created.ejs"),
//     {
//       userName: name,
//       userEmail: email,
//       tempPassword: password,
//     },
//   );

//   await transporter.sendMail({
//     from: config.smtp_sender_email,
//     to: email,
//     subject: "Your Elite Online Account Has Been Created!",
//     html: html,
//   });

//   return customer;
// };

// export const AdminServices = {
//   createCustomerAccount,
//   createCollectorAccount,
// };
