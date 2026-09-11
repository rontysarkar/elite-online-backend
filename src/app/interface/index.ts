import { Role } from "../../generated/prisma/enums";

export interface IRequestUser {
	userId: string;
	name: string;
	email: string;
	role: Role;
}

export interface IQuery {
	searchTerm?: string;
	page?: string;
	limit?: string;
	sortOrder?: string;
	sortBy?: string;

	//any other filter fields can be added here
	[key: string]: any;
}
