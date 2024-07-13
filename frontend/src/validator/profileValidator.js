import { z } from "zod";

import { formatPhoneNumber, specialCharacterRegex } from "../utils/constants";

const profileSchema = z.object({
  firstName: z
    .string()
    .max(60, "Quá dài")
    .regex(specialCharacterRegex, "Không được chứa ký tự đặc biệt"),
  lastName: z
    .string()
    .max(60, "Quá dài")
    .regex(specialCharacterRegex, "Không được chứa ký tự đặc biệt"),
  phoneNumber: z
    .string()
    .regex(formatPhoneNumber, {
      message: "Không đúng định dạng số điện thoại",
    }),
});

export default profileSchema;
