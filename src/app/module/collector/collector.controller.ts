import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CollectorServices } from "./collector.service";

const createCollectorAccount = catchAsync(
	async (req: Request, res: Response) => {
		const payload = req.body;
		const result = await CollectorServices.createCollectorAccount(payload);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Collector Account Created Successfully",
			data: result,
		});
	},
);

const getAllCollector = catchAsync(async (req: Request, res: Response) => {
	const result = await CollectorServices.getAllCollector();
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Collector Retrieve  Successfully",
		data: result,
	});
});

export const CollectorController = {
	createCollectorAccount,
	getAllCollector,
};
