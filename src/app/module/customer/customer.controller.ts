import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CustomerServices } from "./customer.service";

const createCustomerAccount = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await CustomerServices.createCustomerAccount(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Customer Created Successfully",
      data: result,
    });
  },
);

const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const { data, meta } = await CustomerServices.getAllCustomers(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers Retrieve Successfully",
    data,
    meta,
  });
});

const getMyCustomers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const user = req.user!;
  const { data, meta } = await CustomerServices.getMyCustomers(query,user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers Retrieve Successfully",
    data,
    meta,
  });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const data = await CustomerServices.getCustomerById(customerId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers Retrieve Successfully",
    data,
  });
});

const updateCustomerInfo = catchAsync(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const payload = req.body;

  const data = await CustomerServices.updateCustomerInfo(
    customerId as string,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers Information Updated Successfully",
    data,
  });
});

export const CustomerController = {
  createCustomerAccount,
  getAllCustomers,
  getMyCustomers,
  getCustomerById,
  updateCustomerInfo,
};
