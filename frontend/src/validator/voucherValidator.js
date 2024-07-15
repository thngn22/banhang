import { z } from "zod";
import { numericRegex } from "../utils/constants";

const createSchema = z
  .object({
    voucherCode: z
      .string()
      .min(1, "Mời nhập mã Voucher")
      .max(60, "Mã Voucher quá dài")
      .nonempty({ message: "Mã Voucher không được để trống" }),
    name: z
      .string()
      .min(1, "Mời nhập tên")
      .max(60, "Tên quá dài")
      .nonempty({ message: "Tên không được để trống" }),
    discountRate: z
      .union([
        z.string().nonempty("Tỉ lệ giảm giá không được để trống"),
        z.number(),
      ])
      .transform((val) => Number(val))
      .refine((val) => val >= 0 && val <= 100, {
        message: "Tỉ lệ giảm giá phải trong khoảng từ 0 đến 100",
      }),
    maximumDiscountValidPrice: z
      .string()
      .regex(numericRegex, "Giá trị giảm giá tối đa phải là số")
      .transform((val) => Number(val)), // Chuyển đổi thành số
    minimumCartPrice: z
      .string()
      .regex(numericRegex, "Giá trị đơn hàng tối thiểu phải là số")
      .transform((val) => Number(val)), // Chuyển đổi thành số
    quantity: z
      .string()
      .regex(numericRegex, "Số lượng phải là số")
      .transform((val) => Number(val)), // Chuyển đổi thành số
    dateRange: z
      .array(z.string().nonempty("Không được để trống"))
      .length(2, "Phải chọn ngày bắt đầu và ngày kết thúc"),
  })
  .refine((data) => data.minimumCartPrice > data.maximumDiscountValidPrice, {
    message: "Giá trị đơn hàng tối thiểu phải nhỏ hơn giá trị giảm giá tối đa",
    path: ["minimumCartPrice"],
  });

const updateSchema = z
  .object({
    voucherCode: z
      .string()
      .min(1, "Mời nhập mã Voucher")
      .max(60, "Mã Voucher quá dài")
      .nonempty({ message: "Mã Voucher không được để trống" }),
    name: z
      .string()
      .min(1, "Mời nhập tên")
      .max(60, "Tên quá dài")
      .nonempty({ message: "Tên không được để trống" }),
    discountRate: z
      .union([
        z.string().nonempty("Tỉ lệ giảm giá không được để trống"),
        z.number(),
      ])
      .transform((val) => Number(val))
      .refine((val) => val >= 0 && val <= 100, {
        message: "Tỉ lệ giảm giá phải trong khoảng từ 0 đến 100",
      }),
    maximumDiscountValidPrice: z
      .string()
      .regex(numericRegex, "Giá trị giảm giá tối đa phải là số")
      .transform((val) => Number(val)), // Chuyển đổi thành số
    minimumCartPrice: z
      .string()
      .regex(numericRegex, "Giá trị đơn hàng tối thiểu phải là số")
      .transform((val) => Number(val)), // Chuyển đổi thành số
    quantity: z
      .string()
      .regex(numericRegex, "Số lượng phải là số")
      .transform((val) => Number(val)), // Chuyển đổi thành số
    dateRange: z
      .array(z.string().nonempty("Không được để trống"))
      .length(2, "Phải chọn ngày bắt đầu và ngày kết thúc"),
  })
  .refine((data) => data.minimumCartPrice > data.maximumDiscountValidPrice, {
    message: "Giá trị đơn hàng tối thiểu phải nhỏ hơn giá trị giảm giá tối đa",
    path: ["minimumCartPrice"],
  });

const voucherSchema = {
  createSchema,
  updateSchema,
};

export default voucherSchema;
