import { z } from "zod";

import {
  formatPhoneNumber,
  emailRegex,
  strongPasswordRegex,
} from "../utils/constants";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Bạn phải nhập Họ").max(60, "Quá dài"),
    lastName: z.string().min(1, "Bạn phải nhập Tên").max(60, "Quá dài"),
    phoneNumber: z.string().regex(formatPhoneNumber, {
      message: "Số điện thoại không đúng định dạng",
    }),
    email: z
      .string()
      .regex(emailRegex, { message: "Email không đúng định dạng" }),
    password: z.string().regex(strongPasswordRegex, {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Xác nhận mật khẩu không được để trống" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"], // Path of error
  });

export default signUpSchema;
