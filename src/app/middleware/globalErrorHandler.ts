import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";
import config from "../config";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (config.node_env === "development") {
    console.error("❌ Error from Global Error Handler:", err);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = "Something went wrong on the server!";
  let errorName = "InternalServerError";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    errorName = err.name || "AppError";
  } else if (err instanceof Error) {
    errorName = err.name;
    if (config.node_env === "development") {
      errorMessage = err.message;
    }
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    error: config.node_env === "development" ? err : undefined,
    stack: config.node_env === "development" ? err.stack : undefined,
  });
};
