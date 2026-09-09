// import { Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import httpStatus from "http-status";
// import { AdminServices } from "./admin.service";

// const createCustomerAccount = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.body;
//   const result = await AdminServices.createCustomerAccount(payload);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Customer Created Successfully",
//     data: result,
//   });
// });


// const createCollectorAccount = catchAsync(async (req: Request, res: Response) => {
//   const payload = req.body;
//   const result = await AdminServices.createCollectorAccount(payload);
//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Collector Account Created Successfully",
//     data: result,
//   });
// });




// export const AdminController = {
//     createCustomerAccount,
//     createCollectorAccount,
    
// }
