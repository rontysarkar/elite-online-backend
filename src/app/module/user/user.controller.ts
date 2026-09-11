import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.service";

const getUsers = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const { users, meta } = await UserServices.getUsers(query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Users Retrieve Successfully",
		data: users,
		meta,
	});
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params?.userId;
	const result = await UserServices.getUserById(userId as string);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Retrieve Successfully",
		data: result,
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!;
	const result = await UserServices.getMe(user);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Info Retrieve Successfully",
		data: result,
	});
});

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params?.userId;
	const result = await UserServices.deleteUserById(userId as string);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Deleted Successfully",
		data: result,
	});
});

export const UserController = {
	getUsers,
	getUserById,
	deleteUserById,
	getMe,
};
