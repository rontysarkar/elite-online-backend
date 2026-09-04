import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { ICreateAreaPayload } from "./area.interface";

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

const getAllArea = async () => {
  const area = await prisma.area.findMany();

  if (!area) {
    throw new AppError(httpStatus.NOT_FOUND, "Area Dose not exist");
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
    getCollectorArea
}
