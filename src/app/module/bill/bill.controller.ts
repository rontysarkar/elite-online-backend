import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BillServices } from "./bill.service";

const generateMonthlyBills = catchAsync(async (req: Request, res: Response) => {
  const result = await BillServices.generateMonthlyBills();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bills Generated Successfully",
    data: result,
  });
});

const generateCustomerBill = catchAsync(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const result = await BillServices.generateCustomerBill(customerId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bill Generated Successfully",
    data: result,
  });
});

export const BillController = {
  generateMonthlyBills,
  generateCustomerBill,
};
