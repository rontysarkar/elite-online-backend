import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PackageServices } from "./package.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPackage = catchAsync(async(req:Request,res:Response)=>{

    const payload = req.body;
    const result = await PackageServices.createPackage(payload);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Package Created Successfully",
        data:result
    })
})

const getAllPackage = catchAsync(async(req:Request,res:Response)=>{

    const result = await PackageServices.getAllPackage();

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"All Package Retrieved Successfully",
        data:result
    })
})

export const PackageController ={
    createPackage,
    getAllPackage,
}