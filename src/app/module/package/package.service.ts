import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreatePackagePayload } from "./package.interface";


const createPackage = async (payload: ICreatePackagePayload) => {
	const pkg = await prisma.package.create({
		data: {
			...payload,
		},
	});

    return pkg;
};


const getAllPackage = async()=>{
    
    const pkg = await prisma.package.findMany({})
    return pkg;
}


export const PackageServices = {
    createPackage,
    getAllPackage,
}