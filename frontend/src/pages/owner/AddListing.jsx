import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Home,
  DollarSign,
  Check,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { colors } from "@/utils/colors";
import { listingValidationSchema } from "@/yup/listingValidationSchema";
import ImageUploader from "@/components/owner/ImageUploader";
import FormField from "@/components/owner/FormField";

// Main Add Listing Component
export default function AddListingPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenitiesOptions = [
    "Wi-Fi",
    "AC",
    "Kitchen",
    "Parking",
    "Security",
    "Elevator",
    "Gym",
    "Pool",
    "Laundry",
    "Balcony",
    "Garden",
    "Pets Allowed",
  ];

  const initialValues = {
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    propertyType: "",
    monthlyRent: "",
    securityDeposit: "",
    bedrooms: 1,
    bathrooms: 1,
    seatingCapacity: 1,
    area: "",
    furnishing: "",
    amenities: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: listingValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      // Simulate API call
      console.log(values);

      const listingData = {
        ...values,
        images: images.map((img) => img.url),
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: "available",
      };

      console.log("Listing created:", listingData);
      alert("Listing created successfully!");
      setIsSubmitting(false);
      //   navigate("/dashboard");
    },
  });

  const handleAmenityChange = (amenity) => {
    const currentAmenities = formik.values.amenities;
    if (currentAmenities.includes(amenity)) {
      formik.setFieldValue(
        "amenities",
        currentAmenities.filter((a) => a !== amenity)
      );
    } else {
      formik.setFieldValue("amenities", [...currentAmenities, amenity]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-blue-600 bg-blue-500 text-white hover:text-white"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1
                className="text-lg sm:text-xl md:text-3xl font-bold"
                style={{ color: colors.primary }}
              >
                Add New Property
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Create a new property listing
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Property Details Card */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader
              className="rounded-t-lg text-white p-4"
              style={{
                background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
              }}
            >
              <CardTitle className="flex items-center gap-2 text-white">
                <Home size={24} />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                label="Property Title"
                error={formik.errors.title}
                touched={formik.touched.title}
                required
              >
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Spacious 2BHK apartment in prime location"
                  className="text-base sm:text-lg"
                />
              </FormField>

              <FormField
                label="Description"
                error={formik.errors.description}
                touched={formik.touched.description}
                required
              >
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Detailed description of your property, highlighting key features and nearby amenities..."
                  rows={5}
                  className="resize-none"
                />
                <div className="text-right text-sm text-gray-500">
                  {formik.values.description.length}/1000 characters
                </div>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Property Type"
                  error={formik.errors.propertyType}
                  touched={formik.touched.propertyType}
                  required
                >
                  <Select
                    value={formik.values.propertyType}
                    onValueChange={(value) =>
                      formik.setFieldValue("propertyType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">Independent House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="pg">PG/Hostel</SelectItem>
                      <SelectItem value="studio">Studio Apartment</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Furnishing"
                  error={formik.errors.furnishing}
                  touched={formik.touched.furnishing}
                  required
                >
                  <Select
                    value={formik.values.furnishing}
                    onValueChange={(value) =>
                      formik.setFieldValue("furnishing", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fully-furnished">
                        Fully Furnished
                      </SelectItem>
                      <SelectItem value="semi-furnished">
                        Semi Furnished
                      </SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader
              className="rounded-t-lg text-white p-4"
              style={{
                background: "linear-gradient(to right, #10b981, #0d9488)",
              }}
            >
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin size={24} />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                label="Complete Address"
                error={formik.errors.address}
                touched={formik.touched.address}
                required
              >
                <Textarea
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="House/Flat number, Building name, Street, Area"
                  rows={3}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="City"
                  error={formik.errors.city}
                  touched={formik.touched.city}
                  required
                >
                  <Input
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Mumbai"
                  />
                </FormField>

                <FormField
                  label="State"
                  error={formik.errors.state}
                  touched={formik.touched.state}
                  required
                >
                  <Input
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Maharashtra"
                  />
                </FormField>

                <FormField
                  label="Pincode"
                  error={formik.errors.pincode}
                  touched={formik.touched.pincode}
                  required
                >
                  <Input
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="400001"
                    maxLength={6}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Property Specifications Card */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader
              className="rounded-t-lg text-white p-4"
              style={{
                background: "linear-gradient(to right, #8b5cf6, #ec4899)",
              }}
            >
              <CardTitle className="flex items-center gap-2 text-white">
                <Square size={24} />
                Property Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  label="Bedrooms"
                  error={formik.errors.bedrooms}
                  touched={formik.touched.bedrooms}
                  required
                >
                  <Input
                    name="bedrooms"
                    type="number"
                    value={formik.values.bedrooms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="3"
                    min="1"
                    max="10"
                  />
                </FormField>

                <FormField
                  label="Bathrooms"
                  error={formik.errors.bathrooms}
                  touched={formik.touched.bathrooms}
                  required
                >
                  <Input
                    name="bathrooms"
                    type="number"
                    value={formik.values.bathrooms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="2"
                    min="1"
                    max="10"
                  />
                </FormField>

                <FormField
                  label="Area (sq ft)"
                  error={formik.errors.area}
                  touched={formik.touched.area}
                  required
                >
                  <Input
                    name="area"
                    type="number"
                    value={formik.values.area}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="1200"
                    min="100"
                    max="10000"
                  />
                </FormField>

                <FormField
                  label="Seating Capacity"
                  error={formik.errors.seatingCapacity}
                  touched={formik.touched.seatingCapacity}
                  required
                >
                  <Input
                    name="seatingCapacity"
                    type="number"
                    value={formik.values.seatingCapacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="4"
                    min="1"
                    max="100"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader
              className="rounded-t-lg text-white p-4"
              style={{
                background: "linear-gradient(to right, #f97316, #dc2626)",
              }}
            >
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign size={24} />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Monthly Rent (₹)"
                  error={formik.errors.monthlyRent}
                  touched={formik.touched.monthlyRent}
                  required
                >
                  <Input
                    name="monthlyRent"
                    type="number"
                    value={formik.values.monthlyRent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="25000"
                    min="1000"
                    max="500000"
                  />
                </FormField>

                <FormField
                  label="Security Deposit (₹)"
                  error={formik.errors.securityDeposit}
                  touched={formik.touched.securityDeposit}
                  required
                >
                  <Input
                    name="securityDeposit"
                    type="number"
                    value={formik.values.securityDeposit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="50000"
                    min="0"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Amenities Card */}
          <Card className="shadow-lg border-0">
            <CardHeader
              className="rounded-t-lg text-white p-4"
              style={{
                background: "linear-gradient(to right, #6366f1, #3b82f6)",
              }}
            >
              <CardTitle className="flex items-center gap-2 text-white">
                <Home size={24} />
                Amenities & Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                label="Select Available Amenities"
                error={formik.errors.amenities}
                touched={formik.touched.amenities}
                required
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {amenitiesOptions.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-3">
                      <Checkbox
                        id={amenity}
                        checked={formik.values.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityChange(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium cursor-pointer hover:text-blue-600"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {formik.values.amenities.length} amenities
                </div>
              </FormField>
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card className="shadow-lg border-0 p-0">
            <CardHeader
              className="rounded-t-lg text-white p-4"
              style={{
                background: "linear-gradient(to right, #14b8a6, #10b981)",
              }}
            >
              <CardTitle className="flex items-center gap-2 text-white">
                <Camera size={24} />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ImageUploader images={images} onImagesChange={setImages} />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className="w-full md:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Listing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check size={20} />
                  Create Property Listing
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
