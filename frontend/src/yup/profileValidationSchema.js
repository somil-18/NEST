
import * as Yup from "yup";

// Validation Schema
export const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  address: Yup.string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
  dateOfBirth: Yup.date().max(
    new Date(),
    "Date of birth cannot be in the future"
  ),
  occupation: Yup.string().max(
    100,
    "Occupation must be less than 100 characters"
  ),
});