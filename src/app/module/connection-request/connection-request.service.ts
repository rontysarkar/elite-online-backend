import { prisma } from "../../lib/prisma";
import { ICreateConnectionRequestPayload } from "./connection-request.interface";

const createConnectionRequest = async (
  payload: ICreateConnectionRequestPayload,
) => {
  const { name, email, phone, address, areaId, packageId } = payload;

  const connectionRequest = await prisma.connectionRequest.create({
    data: {
      name,
      email,
      phone,
      address,
      packageId,
      areaId,
    },
  });

  return connectionRequest;
};

export const ConnectionRequestServices = {
  createConnectionRequest,
};
