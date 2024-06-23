import { z } from "zod";
import { emailRegex } from "../utils/constants";

const signInSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email required to enter" })
    .regex(emailRegex, { message: "Invalid Email" }),
  password: z.string().nonempty({ message: "Password required to enter" }),
});

export default signInSchema;
