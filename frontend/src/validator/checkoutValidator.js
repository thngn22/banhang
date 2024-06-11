import { z } from "zod";

const checkOutSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter your first and last name")
    .max(60, "Name is too long"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,11}$/, { message: "Invalid phone number" })
    .nonempty({ message: "Phone number required to enter" }),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string().nonempty({ message: "Address required to enter" }),
  voucher: z.string().max(10, "Voucher is too long"),
  delivery: z
    .number()
    .refine((value) => value !== undefined, {
      message: "Delivery required to enter",
    }),
  paymentMethod: z
    .number()
    .refine((value) => value !== undefined, {
      message: "Payment method required to enter",
    }),
});

export default checkOutSchema;
