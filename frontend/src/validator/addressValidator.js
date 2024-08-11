import { z } from "zod";

const createSchema = z.object({
  city: z.string().min(1, "Tỉnh/Thành phố không được để trống"),
  district: z.string().min(1, "Quận/Huyện không được để trống"),
  ward: z.string().min(1, "phường/Xã không được để trống"),
  address: z.string().min(1, "Địa chỉ cụ thể không được để trống"),
  is_default: z.boolean(),
});

const updateSchema = z.object({
  city: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string(),
  is_default: z.boolean(),
});

const addressSchema = {
  createSchema,
  updateSchema,
};

export default addressSchema;
