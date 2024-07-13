import { z } from "zod";
import { emailRegex } from "../utils/constants";

const signInSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email không được để trống" })
    .regex(emailRegex, { message: "Không đúng định dạng Email" }),
  password: z.string().nonempty({ message: "Mật khẩu không được để trống" }),
});

export default signInSchema;
