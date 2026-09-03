import { z } from 'zod';

const strictBdPhoneRegex = /^01[3-9]\d{8}$/;

export const LoginPayloadSchema = z.object({
  emailOrPhone: z.union([
     z.email('Invalid email format'),
    z.string().regex(strictBdPhoneRegex, 'Invalid phone number format')
  ]),
  password:z.string()
});
