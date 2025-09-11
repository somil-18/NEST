import * as Yup from "yup";

// Updated Validation Schema with pid, ownerName and corrected field names
export const listingValidationSchema = Yup.object({
  // NEW: Verification fields
  pid: Yup.string()
    .required("Property ID (pid) is required")
    .min(3, "Property ID seems too short")
    .max(20, "Property ID is too long"),

  ownerName: Yup.string()
    .required("Owner name is required")
    .min(2, "Owner name is too short")
    .max(50, "Owner name is too long")
    .matches(/^[a-zA-Z\s]+$/, "Owner name can only contain letters and spaces"),

  // UPDATED: Property details
  title: Yup.string()
    .required("Property title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),

  description: Yup.string()
    .notRequired() // Made optional as per your data structure
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),

  // UPDATED: Changed from 'address' to 'street_address'
  street_address: Yup.string()
    .required("Street address is required")
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address is too long"),

  city: Yup.string()
    .required("City is required")
    .min(2, "City name is too short")
    .max(50, "City name is too long"),

  state: Yup.string()
    .required("State is required")
    .min(2, "State name is too short")
    .max(50, "State name is too long"),

  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),

  propertyType: Yup.string()
    .required("Property type is required")
    .oneOf(
      ["Apartment", "House", "Villa", "PG", "Studio", "Penthouse"], 
      "Please select a valid property type"
    ),

  monthlyRent: Yup.number()
    .required("Monthly rent is required")
    .positive("Rent must be positive")
    .min(1000, "Minimum rent is ₹1,000")
    .max(500000, "Maximum rent is ₹5,00,000")
    .integer("Rent must be a whole number"),

  securityDeposit: Yup.number()
    .required("Security deposit is required")
    .min(0, "Security deposit cannot be negative")
    .max(1000000, "Security deposit seems too high")
    .integer("Security deposit must be a whole number"),

  bedrooms: Yup.number()
    .required("Number of bedrooms is required")
    .min(0, "Bedrooms cannot be negative")
    .max(10, "Cannot exceed 10 bedrooms")
    .integer("Bedrooms must be a whole number"),

  bathrooms: Yup.number()
    .required("Number of bathrooms is required")
    .min(1, "Must have at least 1 bathroom")
    .max(10, "Cannot exceed 10 bathrooms")
    .integer("Bathrooms must be a whole number"),

  // UPDATED: Changed from number to string and made optional
  area: Yup.string()
    .notRequired()
    .min(3, "Area description is too short")
    .max(20, "Area description is too long"),

  // UPDATED: Changed from 'seatingCapacity' to 'seating'
  seating: Yup.number()
    .required("Seating capacity is required")
    .min(1, "Must accommodate at least 1 person")
    .max(50, "Seating capacity seems too high")
    .integer("Seating capacity must be a whole number"),

  furnishing: Yup.string()
    .notRequired() // Made optional as per your data structure
    .oneOf(
      ["Fully-Furnished", "Semi-Furnished", "Unfurnished", ""], 
      "Please select a valid furnishing option"
    ),

  amenities: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one amenity")
    .required("Amenities selection is required"),
});
