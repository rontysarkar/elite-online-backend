import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IChangePasswordPayload, ILoginPayload } from "./auth.interface";
import httpStatus from "http-status";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";
import { IRequestUser } from "../../interface";

const loginUser = async (payload: ILoginPayload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User Is Deleted");
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    isUserExist.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Credentials");
  }

  const jwtPayload = {
    userId: isUserExist.id,
    name: isUserExist.name,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  user: IRequestUser,
) => {
  const { current_password, new_password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const isMatchPassword = await bcrypt.compare(
    current_password,
    isUserExist.password,
  );
  if (!isMatchPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect Current Password");
  }

  const hashPassword = await bcrypt.hash(new_password,Number(config.bcrypt_salt_rounds))

  await prisma.user.update({
    where:{
      id:isUserExist.id
    },
    data:{
      password:hashPassword
    }
  })

  return null;
};

// const forgotPassword = async(email)

export const AuthService = {
  loginUser,
  changePassword,
};
