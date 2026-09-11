import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { ICreateAreaPayload, IUpdateAreaPayload } from "./area.interface";

const createArea = async (payload: ICreateAreaPayload) => {
  const { name, collectorId } = payload;

  const isCollectorExist = await prisma.user.findUnique({
    where: {
      id: collectorId,
      role: Role.COLLECTOR,
    },
  });

  if (!isCollectorExist) {
    throw new AppError(httpStatus.CONFLICT, "Collector dose not exist");
  }

  const area = await prisma.area.create({
    data: {
      name,
      collectorId,
    },
  });

  return area;
};

const updatedAreaCollector = async (payload: IUpdateAreaPayload, areaId: string) => {
  const {  collectorId } = payload;

  const isCollectorExist = await prisma.user.findUnique({
    where: {
      id: collectorId,
      role: Role.COLLECTOR,
    },
  });

  if (!isCollectorExist) {
    throw new AppError(httpStatus.CONFLICT, "Collector dose not exist");
  }

  const isAreaExist = await prisma.area.findUnique({ where: { id: areaId } });

  if (!isAreaExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Area Dose Not Exist");
  }

  if(isCollectorExist.id === isAreaExist.collectorId){
    throw new AppError(httpStatus.BAD_REQUEST,"Already Assign This collector for this area")
  }

  const updatedArea = await prisma.area.update({
    where: {
      id: areaId,
    },
    data: {
      collectorId,
    },
    include:{
      collector:{
        select:{
          id:true,
          name:true
        }
      }
    }
  });

  return updatedArea;
};

const getAllArea = async () => {
  const area = await prisma.area.findMany({
    include:{
      collector:{
        select:{
          id:true,
          name:true,

        }
      },
      _count:{
        select:{
          customer:true,
        }
      }
    }
  });

  if (!area) {
    throw new AppError(httpStatus.NOT_FOUND, "Area Dose not exist");
  }

  return area;
};

const getAreaById = async (areaId: string) => {
  const area = await prisma.area.findUnique({
    where: {
      id: areaId,
    },
    include: {
      collector: {
        select:{
          id:true,
          name:true,
          phone:true
        }
      },
      _count: {
        select: {
          customer: true,
        },
      },
    },
  });
  if (!area) {
    throw new AppError(httpStatus.NOT_FOUND, "Area Not Found");
  }

  return area;
};

const getCollectorArea = async (collectorId: string) => {
  const area = await prisma.area.findMany({
    where: {
      collectorId,
    },
  });

  if (!area) {
    throw new AppError(httpStatus.NOT_FOUND, "Area Dose not exist");
  }

  return area;
};

export const AreaServices = {
  createArea,
  getAllArea,
  getAreaById,
  getCollectorArea,
  updatedAreaCollector,
};
