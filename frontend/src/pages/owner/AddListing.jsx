/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Home,
  DollarSign,
  Check,
  Square,
  Building,
  Upload,
  X,
  Shield,
  Edit,
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
import FormField from "@/components/owner/FormField";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Enhanced Image Uploader Component - Updated to handle URLs and Files
const ImageUploader = ({ images, onImagesChange, maxImages = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files) => {
    const newImages = Array.from(files).slice(0, maxImages - images.length);

    newImages.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
            name: file.name,
            type: "file", // Mark as file type
          };
          onImagesChange((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    onImagesChange((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : images.length >= maxImages
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {images.length >= maxImages ? (
              <Check className="w-8 h-8 text-gray-400" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {images.length >= maxImages ? (
            <div>
              <p className="text-gray-500 font-medium">
                Maximum images uploaded
              </p>
              <p className="text-sm text-gray-400">
                You can upload up to {maxImages} images
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">
                Drop images here or{" "}
                <label
                  htmlFor="image-upload"
                  className="text-blue-600 cursor-pointer hover:text-blue-700 underline"
                >
                  browse
                </label>
              </p>
              <p className="text-sm text-gray-500">
                {images.length}/{maxImages} images • PNG, JPG up to 10MB each
              </p>
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={image.url}
                  alt={image.name || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
              {/* Show if it's an existing URL or new file */}
              {image.type === "url" && (
                <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Existing
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500 font-medium">
            ⚠️ At least 1 image is required
          </p>
        </div>
      )}
    </div>
  );
};

// Main Add/Edit Listing Component
export default function AddEditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine if we're in edit mode based on route
  const edit = location.pathname.includes('/edit') && !!id;

  const amenitiesOptions = [
    "Wifi",
    "Geyser",
    "TV",
    "Air Conditioning",
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
    "table",
    "chairs",
  ];

  const propertyTypes = [
    { value: "Apartment", label: "Apartment" },
    { value: "House", label: "Independent House" },
    { value: "Villa", label: "Villa" },
    { value: "PG", label: "PG/Hostel" },
    { value: "Studio", label: "Studio Apartment" },
    { value: "Penthouse", label: "Penthouse" },
  ];

  const furnishingOptions = [
    { value: "Fully-Furnished", label: "Fully Furnished" },
    { value: "Semi-Furnished", label: "Semi Furnished" },
    { value: "Unfurnished", label: "Unfurnished" },
  ];

  const initialValues = {
    // Verification fields
    pid: "",
    ownerName: "",
    // Property details
    title: "",
    description: "",
    street_address: "",
    city: "",
    state: "",
    pincode: "",
    propertyType: "",
    monthlyRent: "",
    securityDeposit: "",
    bedrooms: 1,
    bathrooms: 1,
    seating: 1,
    area: "",
    furnishing: "",
    amenities: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: listingValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (images.length === 0) {
        toast.error("Please upload at least 1 image");
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();

        // Create the data payload object with all required fields
        const dataPayload = {
          pid: values.pid,
          ownerName: values.ownerName,
          title: values.title,
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          propertyType: values.propertyType,
          monthlyRent: parseInt(values.monthlyRent),
          securityDeposit: parseInt(values.securityDeposit),
          bedrooms: parseInt(values.bedrooms),
          bathrooms: parseInt(values.bathrooms),
          seating: parseInt(values.seating),
          amenities: values.amenities,
          // Optional fields
          ...(values.description && { description: values.description }),
          ...(values.area && { area: values.area }),
          ...(values.furnishing && { furnishing: values.furnishing }),
        };

        // Add existing image URLs if in edit mode
        if (edit) {
          const existingImageUrls = images
            .filter((img) => img.type === "url")
            .map((img) => img.url);

          if (existingImageUrls.length > 0) {
            dataPayload.existing_images = existingImageUrls;
          }
        }

        formData.append("data", JSON.stringify(dataPayload));

        // Only append new image files (not existing URLs)
        const newImages = images.filter((img) => img.file);
        if (newImages.length > 0) {
          newImages.forEach((image) => {
            formData.append("images", image.file);
          });
        } else if (!edit) {
          // For new listings, at least one new image is required
          toast.error("Please upload at least one image");
          return;
        }

        console.log("Form Data being sent:");
        for (let [key, value] of formData.entries()) {
          if (key === "data") {
            console.log(key, JSON.parse(value));
          } else {
            console.log(key, value);
          }
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const url = edit
          ? `${API_URL}/listings/${id}`
          : `${API_URL}/listings/create`;

        const method = edit ? "patch" : "post";

        const response = await axios[method](url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.access_token}`,
          },
        });

        console.log("Response:", response);

        if (response.data?.success) {
          toast.success(
            response.data.message ||
              `Property listing ${edit ? "updated" : "created"} successfully!`
          );
          navigate("/owner");
        } else {
          toast.error(
            response.data.message ||
              `Failed to ${edit ? "update" : "create"} listing`
          );
        }
      } catch (error) {
        console.error(
          `Error ${edit ? "updating" : "creating"} listing:`,
          error
        );

        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            `Failed to ${edit ? "update" : "create"} listing. Please try again.`
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Fetch existing listing data if in edit mode
  useEffect(() => {
    const fetchListingData = async () => {
      if (!edit || !id) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response);

        if (response.data?.success) {
          const listing = response.data.data;
          console.log("Listing data:", listing);

          // Set form values - using exact field names from your API response
          formik.setValues({
            pid: listing.pid || "",
            ownerName: listing.ownerName || "",
            title: listing.title || "",
            description: listing.description || "",
            street_address: listing.street_address || "",
            city: listing.city || "",
            state: listing.state || "",
            pincode: listing.pincode || "",
            propertyType: listing.propertyType || "",
            monthlyRent: listing.monthlyRent?.toString() || "",
            securityDeposit: listing.securityDeposit?.toString() || "",
            bedrooms: listing.bedrooms || 1,
            bathrooms: listing.bathrooms || 1,
            seating: listing.seating || 1,
            area: listing.area || "",
            furnishing: listing.furnishing || "",
            amenities: listing.amenities || [],
          });

          // Handle existing images - using image_urls from API
          if (listing.image_urls && listing.image_urls.length > 0) {
            const existingImageObjects = listing.image_urls.map(
              (url, index) => ({
                id: `existing-${index}`,
                url: url,
                name: `Existing Image ${index + 1}`,
                type: "url", // Mark as URL type
              })
            );

            setImages(existingImageObjects);
          }

          toast.success("Listing data loaded successfully");
        } else {
          toast.error("Failed to load listing data");
          navigate("/owner");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Failed to load listing data");
        navigate("/owner");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingData();
  }, [edit, id]);

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

  // Show loading state while fetching data
  if (edit && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
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
                className="text-2xl md:text-3xl font-bold"
                style={{ color: colors.primary }}
              >
                {edit ? (
                  <div className="flex items-center gap-2">
                    <Edit size={28} />
                    Edit Property Listing
                  </div>
                ) : (
                  "Add New Property Listing"
                )}
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {edit
                  ? "Update your property listing information and images"
                  : "Create a professional property listing with detailed information and images"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Verification Section */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader
              className="text-white py-6"
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              <CardTitle className="flex items-center gap-3 text-xl">
                <Shield size={28} />
                Property Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <FormField
                    label="Property ID (PID)"
                    error={formik.errors.pid}
                    touched={formik.touched.pid}
                    required
                  >
                    <Input
                      name="pid"
                      value={formik.values.pid}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., PID123456"
                      className="text-lg py-3"
                    />
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField
                    label="Owner Name"
                    error={formik.errors.ownerName}
                    touched={formik.touched.ownerName}
                    required
                  >
                    <Input
                      name="ownerName"
                      value={formik.values.ownerName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., John Doe"
                      className="text-lg py-3"
                    />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader
              className="text-white py-6"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <CardTitle className="flex items-center gap-3 text-xl">
                <Building size={28} />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
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
                  placeholder="e.g., 2 BHK Apartment in Prime Location"
                  className="text-lg py-3"
                />
              </FormField>

              <FormField
                label="Description"
                error={formik.errors.description}
                touched={formik.touched.description}
                helper="Optional: Describe your property features and nearby amenities"
              >
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="A beautiful, fully furnished apartment with a great view..."
                  rows={4}
                  className="resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formik.values.description.length}/500 characters
                </div>
              </FormField>

              {/* Fixed Layout for Property Type, Furnishing, and Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <SelectTrigger className="py-3">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Furnishing"
                  error={formik.errors.furnishing}
                  touched={formik.touched.furnishing}
                  helper="Optional: Furnishing status"
                >
                  <Select
                    value={formik.values.furnishing}
                    onValueChange={(value) =>
                      formik.setFieldValue("furnishing", value)
                    }
                  >
                    <SelectTrigger className="py-3">
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      {furnishingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader
              className="text-white py-6"
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <CardTitle className="flex items-center gap-3 text-xl">
                <MapPin size={28} />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <FormField
                label="Street Address"
                error={formik.errors.street_address}
                touched={formik.touched.street_address}
                required
              >
                <Textarea
                  name="street_address"
                  value={formik.values.street_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="123 Dreamvilla Road, Near City Center"
                  rows={3}
                  className="resize-none"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    placeholder="e.g., Solan"
                    className="py-3"
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
                    placeholder="e.g., Himachal Pradesh"
                    className="py-3"
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
                    placeholder="173212"
                    maxLength={6}
                    className="py-3"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Specifications and Pricing Combined */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Specifications Card */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader
                className="text-white py-6"
                style={{
                  background:
                    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  color: "#374151",
                }}
              >
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Square size={28} />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
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
                      min="0"
                      max="10"
                      className="py-3 text-center"
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
                      min="1"
                      max="10"
                      className="py-3 text-center"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Seating Capacity"
                    error={formik.errors.seating}
                    touched={formik.touched.seating}
                    required
                  >
                    <Input
                      name="seating"
                      type="number"
                      value={formik.values.seating}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      min="1"
                      max="20"
                      className="py-3 text-center"
                    />
                  </FormField>

                  <FormField
                    label="Area"
                    error={formik.errors.area}
                    touched={formik.touched.area}
                    helper="Optional (e.g., 1200 sqft)"
                  >
                    <Input
                      name="area"
                      value={formik.values.area}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="1200 sqft"
                      className="py-3"
                    />
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader
                className="text-white py-6"
                style={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                }}
              >
                <CardTitle className="flex items-center gap-3 text-xl">
                  <DollarSign size={28} />
                  Pricing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
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
                    placeholder="15000"
                    min="1000"
                    className="py-3 text-lg"
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
                    placeholder="5000"
                    min="0"
                    className="py-3 text-lg"
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Amenities Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader
              className="text-white py-6"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <CardTitle className="flex items-center gap-3 text-xl">
                <Home size={28} />
                Amenities & Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <FormField
                label="Available Amenities"
                error={formik.errors.amenities}
                touched={formik.touched.amenities}
                required
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {amenitiesOptions.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={amenity}
                        checked={formik.values.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityChange(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Selected:</strong> {formik.values.amenities.length}{" "}
                  amenities
                  {formik.values.amenities.length > 0 && (
                    <div className="mt-1">
                      {formik.values.amenities.join(", ")}
                    </div>
                  )}
                </div>
              </FormField>
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader
              className="text-white py-6"
              style={{
                background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                color: "#374151",
              }}
            >
              <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                <Camera size={28} />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  📸{" "}
                  {edit
                    ? "Update your property images (1-10 images required)"
                    : "Upload high-quality images of your property (1-10 images required)"}
                </p>
                <p className="text-xs text-gray-500">
                  {edit
                    ? "Existing images are marked with 'Existing' label. You can remove them and add new ones."
                    : "First image will be used as the main display image"}
                </p>
              </div>
              <ImageUploader
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                isEdit={edit}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              disabled={isSubmitting || images.length === 0}
              className="w-full md:w-auto px-12 py-4 text-lg font-semibold text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isSubmitting
                  ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {edit ? "Updating..." : "Creating Listing..."}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {edit ? <Edit size={20} /> : <Check size={20} />}
                  {edit ? "Update Property Listing" : "Create Property Listing"}
                </div>
              )}
            </Button>
          </div>

          {/* Form Validation Summary */}
          {!formik.isValid && formik.submitCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-medium mb-2">
                Please fix the following issues:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(formik.errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
                {images.length === 0 && <li>• At least 1 image is required</li>}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
