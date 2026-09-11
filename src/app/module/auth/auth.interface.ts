export interface ILoginPayload {
	email: string;
	password: string;
}


export interface IChangePasswordPayload {
	current_password:string,
	new_password:string,
}

export interface IResetPasswordPayload {
	email:string,
	new_password:string,
	otp:string,
}