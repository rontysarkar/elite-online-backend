import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";
import config from "../config";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (config.node_env === "development") {
    console.error("❌ Error from Global Error Handler:", err);
  }

  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Something went wrong!";
  let errorName = err.errorSources || [];

  // Handle Prisma Specific Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    errorName = "PrismaClientError";

    // P2003: Foreign Key Constraint (Relation record not found)
    if (err.code === "P2003") {
      statusCode = httpStatus.NOT_FOUND;

      const meta = err.meta as any;
      const constraintName =
        (meta?.driverAdapterError?.cause?.constraint?.index as string) ||
        (meta?.field_name as string) ||
        "";

      const fieldMatch = constraintName.match(/(?:_|^)([a-zA-Z]+)Id(?:_|$)/);

      let entityName = "relation record";
      if (fieldMatch && fieldMatch[1]) {
        entityName = fieldMatch[1];
      }

      const formattedEntity =
        entityName.charAt(0).toUpperCase() + entityName.slice(1);
      errorMessage = `${formattedEntity} ID does not exist in the database.`;
    }
    // P2002: Unique Constraint Violation (Duplicate Data)
    else if (err.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      const targetFields = (err.meta as any)?.target || [];
      const fields = Array.isArray(targetFields) ? targetFields.join(", ") : "";

      errorMessage = `${fields || "Field"} already exists. Must be unique.`;
    }
    // P2025: Record to update or delete not found
    else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      errorMessage =
        ((err.meta as any)?.cause as string) || "Record not found.";
    }
  } else if (err instanceof AppError) {
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
