import { z } from "zod";
import { numericRegex } from "../utils/constants";

const createSchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(20, "Quá dài"),
  parentCategoryId: z.string(),
});

const updateSchema = z.object({
  id: z
    .string()
    .min(1, "Quận/Huyện không được để trống")
    .regex(numericRegex, "Chỉ được là chữ số từ 0-9"),
  name: z.string().max(20, "Quá dài"),
  parentCategoryId: z
    .string()
    .min(1, "Quận/Huyện không được để trống")
    .regex(numericRegex, "Chỉ được là chữ số từ 0-9"),
});

const categorySchema = {
  createSchema,
  updateSchema,
};

export default categorySchema;
