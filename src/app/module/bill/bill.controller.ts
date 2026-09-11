import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { BillServices } from "./bill.service";
// admin

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

const getBillsByAdmin = catchAsync(async (req: Request, res: Response) => {
	const { bills, meta } = await BillServices.getBillsByAdmin(req.query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Bill Retrieve Successfully",
		data: bills,
		meta: meta,
	});
});

// Collector

const getBillsByCollectorId = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user!;
		const { bills, meta } = await BillServices.getBillsByCollectorId(
			req.query,
			user,
		);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Bill Retrieve Successfully",
			data: bills,
			meta: meta,
		});
	},
);

// customer

const getMyBills = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;
	const result = await BillServices.getMyBills(req.query, user?.userId);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Bill Retrieve Successfully",
		data: result,
	});
});

const getBillById = catchAsync(async (req: Request, res: Response) => {
	const result = await BillServices.getBillById(req?.params?.billId as string);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Bill Retrieve Successfully",
		data: result,
	});
});

export const BillController = {
	generateMonthlyBills,
	generateCustomerBill,
	getBillsByAdmin,
	getBillsByCollectorId,
	getMyBills,
	getBillById,
};
