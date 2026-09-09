import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPaymentByCollector = catchAsync(
  async (req: Request, res: Response) => {
    const { billId } = req.body;
    const user = req.user!;
    const result = await PaymentServices.createPaymentByCollector(billId, user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Add Payment Successfully",
      data: result,
    });
  },
);

const createPaymentByCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const { billId } = req.body;
    const user = req.user!;
    const result = await PaymentServices.createPaymentByCustomer(billId, user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Create Payment Successfully,Please Payment using bkash payment",
      data: result,
    });
  },
);

const bkashPaymentCallback = catchAsync(async (req: Request, res: Response) => {
  const { redirectUrl } = await PaymentServices.bkashPaymentCallback(
    req?.query,
  );

  res.redirect(redirectUrl);
});

export const PaymentController = {
  createPaymentByCollector,
  createPaymentByCustomer,
  bkashPaymentCallback,
};
