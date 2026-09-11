import { CustomerStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { IQuery, IRequestUser } from "../../interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { buildQuery } from "../../utils/queryBuilder";
import httpStatus from "http-status";

const getUsers = async (query: IQuery) => {
  const { limit, page, skip, sortBy, sortOrder } = buildQuery(query);

  console.log(limit, page, skip, sortBy, sortOrder);

  const andCondition: UserWhereInput[] = [];

  const users = await prisma.user.findMany({
    where: {
      AND: andCondition,
    },
    omit:{
      password:true
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit:{
      password:true,
    }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  return user;
};

const deleteUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include:{
        customer:true
    }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const deletedUser = user?.customer ? await prisma.user.update({
    where:{
        id:userId
    },
    data:{
        isDeleted:true,
        customer:{
            update:{
                status:CustomerStatus.INACTIVE
            }
        }
    }
  }):await prisma.user.update({
    where:{
        id:userId
    },
    data:{
        isDeleted:true,
    }
  })

  return deletedUser;
};

const getMe = async(user:IRequestUser)=>{

  const userInfo = await prisma.user.findUnique({
    where:{
      id:user.userId
    },
    omit:{
      password:true,
    },
    include:{
      area:{
        select:{
          id:true,
          name:true,
        }
      },
      customer:{
        select:{
          id:true,
          address:true,
          package:true,
          area:{
            select:{
              id:true,
              name:true,
              collector:{
                select:{
                  id:true,
                  name:true,
                  phone:true
                }
              }
            }
          },
          
        }
      }
    }
  })

  if(!userInfo){
    throw new AppError(httpStatus.NOT_FOUND,"User Not Found")
  }

  return userInfo;
}

export const UserServices = {
  getUsers,
  getUserById,
  deleteUserById,
  getMe,
};
