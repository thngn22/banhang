import { z } from "zod";

import { formatPhoneNumber, specialCharacterRegex } from "../utils/constants";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Please enter your first name")
    .max(60, "Name is too long")
    .regex(specialCharacterRegex, "Name cannot contain special characters")
    .nonempty({ message: "First name required to enter" }),
  lastName: z
    .string()
    .min(1, "Please enter your last name")
    .max(60, "Name is too long")
    .regex(specialCharacterRegex, "Name cannot contain special characters")
    .nonempty({ message: "Last name required to enter" }),
  phoneNumber: z
    .string()
    .regex(formatPhoneNumber, { message: "Invalid phone number" })
    .nonempty({ message: "Phone number required to enter" }),
});

export default profileSchema;
