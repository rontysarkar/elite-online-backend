export interface ILoginPayload {
	email: string;
	password: string;
}


export interface IChangePasswordPayload {
	current_password:string,
	new_password:string,
}