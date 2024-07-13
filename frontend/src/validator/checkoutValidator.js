import { z } from "zod";

import { specialCharacterRegex, formatPhoneNumber } from "../utils/constants";

const checkOutSchema = z.object({
  name: z
    .string()
    .min(1, "Bạn phải nhập Họ và Tên")
    .max(60, "Quá dài")
    .regex(specialCharacterRegex, "Không được chứa các ký tự đặc biệt"),
  phoneNumber: z.string().regex(formatPhoneNumber, {
    message: "Không đúng định dạng số điện thoại",
  }),
  city: z.string(),
  district: z.string(),
  ward: z.string(),
  address: z.string().min(1, "Bạn phải nhập Địa chỉ cụ thể"),
  voucher: z.string(),
  deliveryId: z.number().refine((value) => value !== undefined, {
    message: "Phải chọn địa chỉ cụ thể để có phương thức giao hàng hợp lý",
  }),
  paymentMethodId: z.number().refine((value) => value !== undefined, {
    message: "Phải chọn phương thức thanh toán",
  }),
});

export default checkOutSchema;
