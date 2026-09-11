import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const { accessToken, refreshToken } = await AuthService.loginUser(payload);

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24,
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7,
	});

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Login Successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const createAccessToken = catchAsync(async (req: Request, res: Response) => {
	const token = req.cookies?.refreshToken;
	const { accessToken } = await AuthService.createAccessToken(token);

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7,
	});

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Login Successfully",
		data: { accessToken },
	});
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const user = req.user!;
	const result = await AuthService.changePassword(payload, user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Password Change Successfully",
		data: result,
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;
	const result = await AuthService.forgotPassword(email);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "OTP has been sent to your email. Please check and verify.",
		data: result,
	});
});

const setNewPassword = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.setNewPassword(payload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Your Password has been change , Now you can login",
		data: null,
	});
});

export const AuthController = {
	loginUser,
	createAccessToken,
	changePassword,
	forgotPassword,
	setNewPassword,
};
