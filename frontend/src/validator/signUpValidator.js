import { z } from "zod";

import {
  specialCharacterRegex,
  specialCharacterRegex2,
  formatPhoneNumber,
  emailRegex,
  strongPasswordRegex,
} from "../utils/constants";

const signUpSchema = z
  .object({
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
    userName: z
      .string()
      .min(1, "Please enter your user name")
      .max(60, "Name is too long")
      .regex(specialCharacterRegex2, "Name cannot contain special characters")
      .nonempty({ message: "User name required to enter" }),
    phoneNumber: z
      .string()
      .regex(formatPhoneNumber, { message: "Invalid phone number" })
      .nonempty({ message: "Phone number required to enter" }),
    email: z
      .string()
      .regex(emailRegex, { message: "Invalid Email" })
      .nonempty({ message: "Email required to enter" }),
    password: z
      .string()
      .regex(strongPasswordRegex, {
        message:
          "Password must have at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters",
      })
      .nonempty({ message: "Password required to enter" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm password required to enter" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Path of error
  });

export default signUpSchema;
