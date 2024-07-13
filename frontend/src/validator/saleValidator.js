import { z } from "zod";
import { specialCharacterRegex2 } from "../utils/constants";

const saleSchema = z.object({
  name: z
    .string()
    .min(1, "Mời nhập mã khuyến mãi")
    .max(60, "Mã khuyến mãi quá dài")
    .regex(specialCharacterRegex2, "Không cho phép chứa các ký tự đặc biệt")
    .nonempty({ message: "Tên mã khuyến mãi không được để trống" }),
  description: z.string().nonempty("Mô tả không được để trống"),
  discountRate: z
    .union([
      z.string().nonempty("Tỉ lệ giảm giá không được để trống"),
      z.number(),
    ])
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 100, {
      message: "Tỉ lệ giảm giá phải trong khoảng từ 0 đến 100",
    }),
  dateRange: z
    .array(z.string().nonempty("Không được để trống"))
    .length(2, "Phải chọn ngày bắt đầu và ngày kết thúc"),
  idProductList: z
    .array(z.number())
    .min(1, "Danh sách sản phẩm không được để trống"),
});

export default saleSchema;
