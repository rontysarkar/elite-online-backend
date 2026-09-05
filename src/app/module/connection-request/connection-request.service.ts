import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { ICreateConnectionRequestPayload } from "./connection-request.interface";
import httpStatus from "http-status";
import crypto from "crypto";
import { transporter } from "../../lib/nodemailer";
import config from "../../config";
import path from 'path'
import ejs from 'ejs'

const createConnectionRequest = async (
  payload: ICreateConnectionRequestPayload,
) => {
  const { name, email, phone, address, areaId, packageId } = payload;

  const isEmailExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Email Already Exist");
  }

  await prisma.connectionRequest.upsert({
    where: {
      email,
    },
    update: {
      name,
      phone,
      address,
      packageId,
      areaId,
    },
    create: {
      email,
      name,
      phone,
      address,
      packageId,
      areaId,
    },
  });

  const requestEmailVerifyOtpKey = `isp-request-email-verify-otp:${email}`;
  const otp = crypto.randomInt(100000, 1000000);

  await redisClient.set(requestEmailVerifyOtpKey, otp, {
    EX: 60 * 5,
  });

  const html = await ejs.renderFile(path.join(process.cwd(),"src/app/templates/verify-email.ejs"),{
    userName:name,
    otpCode:otp
  })

  const nodemailerOptions = {
    from:config.smtp_sender_email,
    to:email,
    subject:"Verify Your Email Address",
    html
  }

  await transporter.sendMail(nodemailerOptions)

  return null;
};

const requestedEmailVerify = async (email: string, otp: string) => {
  const isEmailExist = await prisma.connectionRequest.findUnique({
    where: {
      email,
    },
  });

  if (!isEmailExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No requests have been received from this email yet.",
    );
  }

  const requestEmailVerifyOtpKey = `isp-request-email-verify-otp:${email}`;

  const redisOtp = await redisClient.get(requestEmailVerifyOtpKey);

  if (!redisOtp) {
    throw new AppError(httpStatus.NOT_FOUND, "Otp has been expire");
  }

  

  if (redisOtp !== otp) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Otp");
  }

  await redisClient.del(requestEmailVerifyOtpKey);

  const connectionRequest = await prisma.connectionRequest.update({
    where:{
      email
    },
    data:{
      emailVerified:true
    }
  })

  return connectionRequest;

};

export const ConnectionRequestServices = {
  createConnectionRequest,
  requestedEmailVerify,
};
