import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ConnectionRequestServices } from "./connection-request.service";

const createConnectionRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await ConnectionRequestServices.createConnectionRequest(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Connection Request Created Successfully",
    data: result,
  });
});

export const ConnectionRequestController = {
    createConnectionRequest,
}