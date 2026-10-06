import { CustomerStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { IQuery } from "../../interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { buildQuery } from "../../utils/queryBuilder";
import httpStatus from "http-status";

const getUsers = async (query: IQuery) => {
	const { limit, page, skip, sortBy, sortOrder } = buildQuery(query);

	const andCondition: UserWhereInput[] = [];

	if(query.searchTerm){
		andCondition.push({
			OR: [
				{
					email: {
						contains: query.searchTerm,
						mode: "insensitive",
					},
				},
				{
					name: {
						contains: query.searchTerm,
						mode: "insensitive",
					},
				},
				{
					phone: {
						contains: query.searchTerm,
						mode: "insensitive",
					},
				},
        ]
		});
	}

	if(query.role){
		andCondition.push({
			role: query.role,
		});
	}

	const users = await prisma.user.findMany({
		where: {
			AND: andCondition,
		},
		omit: {
			password: true,
		},
		take: limit,
		skip,
		orderBy: {
			[sortBy]: sortOrder,
		},
	});

	const total = await prisma.user.count({
		where: {
			AND: andCondition,
		},
	});

	const totalUsers = await prisma.user.count();

	const activeUsers = await prisma.user.count({
		where: {
			isDeleted: false,
		},
	});

	const deletedUsers = await prisma.user.count({
		where: {
			isDeleted: true,
		},
	});

	const data = {
		totalUsers,
		activeUsers,
		deletedUsers,
		users
	}

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPage: Math.ceil(total / limit),
		},
	};
};

const getUserById = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		omit: {
			password: true,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}

	return user;
};

const deleteUserById = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			customer: true,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}

	if(user.isDeleted){
		throw new AppError(httpStatus.BAD_REQUEST, "User Already Deleted");
	}

	const deletedUser = user?.customer
		? await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isDeleted: true,
					customer: {
						update: {
							status: CustomerStatus.INACTIVE,
						},
					},
				},
				omit: {
					password: true,
				},
			})
		: await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					isDeleted: true,
				},
				omit: {
					password: true,
				},
			});

	return deletedUser;
};



export const UserServices = {
	getUsers,
	getUserById,
	deleteUserById,
};
