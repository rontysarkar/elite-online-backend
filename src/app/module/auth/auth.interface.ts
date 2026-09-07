export interface ILoginPayload {
	email: string;
	password: string;
}


export interface IChangePasswordPayload {
	current_password:string,
	new_password:string,
}

export interface ISetNewPasswordPayload {
	email:string,
	newPassword:string,
	otp:string,
}