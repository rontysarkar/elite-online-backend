import { z } from "zod";

const strictBdPhoneRegex = /^01[3-9]\d{8}$/;

export const LoginPayloadSchema = z.object({
  emailOrPhone: z.union([
    z.email("Invalid email format"),
    z.string().regex(strictBdPhoneRegex, "Invalid phone number format"),
  ]),
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
