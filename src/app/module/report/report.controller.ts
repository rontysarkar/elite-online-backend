import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReportServices } from "./report.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAdminReport = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await ReportServices.getAdminReport(query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bills Reports Retrieve Successfully",
      data: result,
    });
  },
);


const getCollectorReport = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const user = req.user!

    const result = await ReportServices.getCollectorReport(query,user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bills Reports Retrieve Successfully",
      data: result,
    });
  },
);


export const ReportController = {
  getAdminReport,
  getCollectorReport,
};
