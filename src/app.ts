import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { PackageRoutes } from "./app/module/package/package.route";
import { AreaRoutes } from "./app/module/area/area.route";
import { CreateConnectionRequestRoutes } from "./app/module/connection-request/connection-request.route";
import { BillRoutes } from "./app/module/bill/bill.route";
import { PaymentRoutes } from "./app/module/payment/payment.route";
import { ReportRoutes } from "./app/module/report/report.route";
import { UserRoutes } from "./app/module/user/user.route";
import { CollectorRoutes } from "./app/module/collector/collector.route";
import { CustomerRoutes } from "./app/module/customer/customer.route";

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
// app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/collectors", CollectorRoutes);
app.use("/api/v1/customers", CustomerRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/packages", PackageRoutes);
app.use("/api/v1/areas", AreaRoutes);
app.use("/api/v1/bills", BillRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/reports", ReportRoutes);
app.use("/api/v1/connection-request", CreateConnectionRequestRoutes);

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
