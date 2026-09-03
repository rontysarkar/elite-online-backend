// import { Role } from "../../../generated/prisma/enums";
// import { prisma } from "../../lib/prisma";
// import { AppError } from "../../utils/AppError";
// import { ICreatePackagePayload } from "./package.interface";
// import httpStatus from 'http-status'

// const createPackage = async(payload:ICreatePackagePayload) =>{

//     const {name,collectorId} = payload;

//     const isCollectorExist = await prisma.user.findUnique({
//         where:{
//             id:collectorId,
//             role:Role.COLLECTOR,
//         }
//     })

//     if(!isCollectorExist){
//         throw new AppError(httpStatus.CONFLICT,"Collector dose not exist")
//     }

//     const package = await prisma.package.create({
//         data:{

//         }
//     })

// }
