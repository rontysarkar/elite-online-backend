import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AppError } from "./app/utils/AppError";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { PackageRoutes } from "./app/module/package/package.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/package",PackageRoutes);

// Basic route
app.get("/", async (_req: Request, res: Response) => {
	res.status(202).json({
		success: true,
		message: "Welcome to Elite Online",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
