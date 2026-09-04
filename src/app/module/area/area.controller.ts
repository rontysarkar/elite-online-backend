import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AreaServices } from "./area.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createArea = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AreaServices.createArea(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Area Created Successfully",
    data: result,
  });
});

const getAllArea = catchAsync(async (req: Request, res: Response) => {
  const result = await AreaServices.getAllArea();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Area Retrieve Successfully",
    data: result,
  });
});

const getCollectorArea = catchAsync(async (req: Request, res: Response) => {
  const collectorId = req.user?.userId;
  const result = await AreaServices.getCollectorArea(collectorId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Collector Area Retrieve Successfully",
    data: result,
  });
});

export const AreaController = {
    createArea,
    getAllArea,
    getCollectorArea
}
