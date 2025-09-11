import * as Yup from "yup";

// Simpler version
export const profileValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  mobile_no: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  address: Yup.string().default("").max(250, "Address too long"),

  age: Yup.string()
    .default("")
    .test("age", "Age must be between 18-100", (value) => {
      if (!value) return true;
      const num = parseInt(value);
      return num >= 18 && num <= 100;
    }),

  bio: Yup.string().default("").max(500, "Bio too long"),

  gender: Yup.string()
    .default("")
    .oneOf(["", "male", "female", "other"], "Invalid gender"),

  username: Yup.string().required("Username is required").min(2, "Too short"),
});
