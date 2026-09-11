import { z } from "zod";

const strictBdPhoneRegex = /^01[3-9]\d{8}$/;

export const LoginPayloadSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string(),
});

export const ChangePasswordPayloadSchema = z.object({
  current_password: z
    .string("Current Password is Required")
    .min(1, "Current Password Field Can Not Be Empty"),
  new_password: z
    .string("New Password is Required")
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const ForgotPasswordPayloadSchema = z.object({
  email: z.email("Invalid email format"),
});

export const ResetPasswordPayloadSchema = z.object({
  email:z.email("Invalid Email Format"),
  new_password:z.string().min(8,"Password Length At Least 8 Character"),
  otp:z.string(),
})
