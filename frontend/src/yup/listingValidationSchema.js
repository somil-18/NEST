import * as Yup from "yup";

// Validation Schema - Fixed validation rules
export const listingValidationSchema = Yup.object({
  title: Yup.string()
    .required("Property title is required")
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must be less than 1000 characters"),

  address: Yup.string()
    .required("Property address is required")
    .min(10, "Address must be at least 10 characters"),

  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),

  state: Yup.string().required("State is required"),

  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),

  propertyType: Yup.string().required("Property type is required"),

  monthlyRent: Yup.number()
    .required("Monthly rent is required")
    .positive("Rent must be positive")
    .min(1000, "Rent must be at least ₹1,000")
    .max(500000, "Rent must be less than ₹5,00,000"),

  securityDeposit: Yup.number()
    .required("Security deposit is required")
    .min(0, "Security deposit cannot be negative"),

  bedrooms: Yup.number()
    .required("Number of bedrooms is required")
    .min(1, "Must have at least 1 bedroom")
    .max(10, "Cannot exceed 10 bedrooms"),

  bathrooms: Yup.number()
    .required("Number of bathrooms is required")
    .min(1, "Must have at least 1 bathroom")
    .max(10, "Cannot exceed 10 bathrooms"),

  area: Yup.number()
    .required("Property area is required")
    .min(100, "Area must be at least 100 sq ft")
    .max(10000, "Area must be less than 10,000 sq ft"),

  seatingCapacity: Yup.number()
    .required("Seating capacity is required")
    .min(1, "Must accommodate at least 1 person")
    .max(100, "Cannot exceed 100 people"),

  furnishing: Yup.string().required("Furnishing status is required"),

  amenities: Yup.array().min(1, "Select at least one amenity"),
});
