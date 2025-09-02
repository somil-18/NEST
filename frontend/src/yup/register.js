import * as Yup from "yup";

export const registrationValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .required("Username is required"),
  mobile_no: Yup.string()
    .min(1, "Phone number must be at least 1 character")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["user", "owner"], "Select a valid role")
    .required("Role is required"),
});

export const registrationInitialValues = {
  username: "",
  email: "",
  password: "",
  mobile_no: "",
  role: "user",
};
