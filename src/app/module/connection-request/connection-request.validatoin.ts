import z from "zod";

const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

export const CreateConnectionRequestSchema = z.object({
  name: z.string("Name is required").min(1, "Name cannot be empty"),
  email: z.email("Invalid email address"),
  phone: z
    .string("Phone number is required")
    .regex(bdPhoneRegex, "Invalid Bangladeshi phone number")
    .transform((val) => {
      if (val.startsWith("+88")) return val.slice(3);
      if (val.startsWith("88")) return val.slice(2);
      return val;
    }),
  address: z.string("Address is required").min(1, "Address cannot be empty"),
  areaId: z.string("Area ID is required"),
  packageId: z.string("Package ID is required"),
});
