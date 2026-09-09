import { CustomerStatus } from "../../../generated/prisma/enums";

export interface ICreateCustomerAccountPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  areaId: string;
  packageId: string;
}


export interface IUpdateCustomerInfoPayload {
  address?: string;
  areaId?: string;
  packageId?: string;
  status?:CustomerStatus;
}