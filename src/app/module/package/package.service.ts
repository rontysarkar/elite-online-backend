import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreatePackagePayload } from "./package.interface";
import httpStatus from "http-status";

const createPackage = async (payload: ICreatePackagePayload) => {
	const pkg = await prisma.package.create({
		data: {
			...payload,
		},
	});

	return pkg;
};



const getAllPackage = async () => {
	const pkg = await prisma.package.findMany({
		include: {
			_count: {
				select: {
					customer: {
						where: {
							user: {
								isDeleted: false,
							}
						}
					}
				}
			}
		}
	});

	if (!pkg || pkg.length === 0) {
		throw new AppError(httpStatus.NOT_FOUND, "Package Not Found");
	}

	const flattenedPackages = pkg.map((item) => {
		const { _count, ...packageData } = item;

		return {
			...packageData,
			totalCustomers: _count?.customer || 0,
		};
	});

	return flattenedPackages;
};


export const PackageServices = {
	createPackage,
	getAllPackage,
};
