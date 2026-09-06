import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ConnectionRequestServices } from "./connection-request.service";

const createConnectionRequest = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result =
      await ConnectionRequestServices.createConnectionRequest(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "An OTP has been sent to your email. Please check and verify.",
      data: result,
    });
  },
);

const requestedEmailVerify = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await ConnectionRequestServices.requestedEmailVerify(
    email,
    String(otp),
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message:
      "Your connection request has been accepted. Our team will get in touch with you very soon.",
    data: result,
  });
});

const acceptConnectionRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { requestedId } = req.params;
    const result = await ConnectionRequestServices.acceptConnectionRequest(
      requestedId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "Customer Account Created Successfully",
      data: result,
    });
  },
);

export const ConnectionRequestController = {
  createConnectionRequest,
  requestedEmailVerify,
  acceptConnectionRequest,
};
