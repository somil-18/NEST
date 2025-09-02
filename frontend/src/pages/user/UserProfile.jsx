import React, { useState } from "react";
import { useFormik } from "formik";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Calendar,
  Home,
  AlertCircle,
  Camera,
  CreditCard,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors } from "@/utils/colors";
import { profileValidationSchema } from "@/yup/profileValidationSchema";
import ChangePassword from "@/components/user/ChangePassword";

// Sample user data
const sampleUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "9876543210",
  address: "123 Main Street, Bandra West, Mumbai, Maharashtra 400050",
  joinedDate: "2023-01-15",
  avatar:
    "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff&size=128",
};

// Sample booking data
const sampleBookings = [
  {
    id: 1,
    propertyTitle: "Luxury Studio Apartment",
    propertyImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    location: "Bandra West, Mumbai",
    checkIn: "2024-12-15",
    checkOut: "2024-12-20",
    totalAmount: 75000,
    status: "confirmed",
    bookingDate: "2024-11-20",
    guests: 2,
  },
  {
    id: 2,
    propertyTitle: "Spacious 2BHK Flat",
    propertyImage:
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400",
    location: "Koramangala, Bangalore",
    checkIn: "2025-01-10",
    checkOut: "2025-01-15",
    totalAmount: 90000,
    status: "pending",
    bookingDate: "2024-12-01",
    guests: 3,
  },
  {
    id: 3,
    propertyTitle: "Premium PG Room",
    propertyImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    location: "Sector 62, Noida",
    checkIn: "2024-10-01",
    checkOut: "2024-10-31",
    totalAmount: 12000,
    status: "completed",
    bookingDate: "2024-09-15",
    guests: 1,
  },
];

// Form Field Component
const FormField = ({
  label,
  icon,
  error,
  touched,
  children,
  required = false,
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
      {icon}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && touched && (
      <div className="flex items-center gap-1 text-red-600 text-sm">
        <AlertCircle size={14} />
        {error}
      </div>
    )}
  </div>
);

// Booking Card Component
const BookingCard = ({ booking }) => {
  const statusColors = {
    confirmed: "bg-green-500 text-white",
    pending: "bg-yellow-500 text-white",
    completed: "bg-blue-500 text-white",
    cancelled: "bg-red-500 text-white",
  };

  const statusIcons = {
    confirmed: <CheckCircle size={14} />,
    pending: <Clock size={14} />,
    completed: <CheckCircle size={14} />,
    cancelled: <XCircle size={14} />,
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
          <img
            src={booking.propertyImage}
            alt={booking.propertyTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            {/* Property Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-800 truncate pr-2">
                  {booking.propertyTitle}
                </h3>
                <Badge
                  className={`${
                    statusColors[booking.status]
                  } border-0 flex items-center gap-1 flex-shrink-0`}
                >
                  {statusIcons[booking.status]}
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="text-sm truncate">{booking.location}</span>
              </div>
            </div>
          </div>

          {/* Booking Details - Horizontal on larger screens, stacked on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-medium block sm:inline">Check-in:</span>
                <p className="text-gray-600 truncate">
                  {new Date(booking.checkIn).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-orange-500 flex-shrink-0" />
              <div>
                <span className="font-medium block sm:inline">Check-out:</span>
                <p className="text-gray-600 truncate">
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User size={14} className="text-purple-500 flex-shrink-0" />
              <div>
                <span className="font-medium block sm:inline">Guests:</span>
                <p className="text-gray-600">
                  {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-green-500 flex-shrink-0" />
              <div>
                <span className="font-medium block sm:inline">Total:</span>
                <p className="font-bold" style={{ color: colors.primary }}>
                  ₹{booking.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Date */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Updated Booking Section with improved header
<div className="mt-12">
  <Card className="shadow-lg border-0">
    <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg p-4">
      <CardTitle className="flex items-center gap-2">
        <Calendar size={24} />
        My Bookings ({sampleBookings.length})
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      {sampleBookings.length === 0 ? (
        <div className="text-center py-12">
          <Home size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            No bookings yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start exploring amazing properties to make your first booking!
          </p>
          <Button style={{ backgroundColor: colors.primary }}>
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sampleBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</div>;

// Main Profile Component
export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: sampleUserData,
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        console.log("Profile updated:", values);
        alert("Profile updated successfully!");
        setEditMode(false);
        setIsSubmitting(false);
      }, 1500);
    },
  });

  const handleCancelEdit = () => {
    formik.resetForm();
    setEditMode(false);
  };

  // Calculate booking statistics
  const bookingStats = {
    total: sampleBookings.length,
    confirmed: sampleBookings.filter((b) => b.status === "confirmed").length,
    completed: sampleBookings.filter((b) => b.status === "completed").length,
    totalSpent: sampleBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <Button
              style={{ backgroundColor: colors.primary }}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
          <p className="text-gray-600">
            Manage your account information and view booking history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 p-0">
              <CardHeader className="bg-gradient-to-r p-2 flex items-center from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center w-full">
                  <CardTitle className="flex items-center gap-2">
                    <User size={24} />
                    Personal Information
                  </CardTitle>
                  <div className="flex gap-2">
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-white hover:bg-white/20"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode(!editMode)}
                      className="text-white hover:bg-white/20"
                    >
                      {editMode ? (
                        <>
                          <Save size={16} className="mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit3 size={16} className="mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={sampleUserData.avatar} />
                      <AvatarFallback>{sampleUserData.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {formik.values.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Member since{" "}
                        {new Date(
                          sampleUserData.joinedDate
                        ).toLocaleDateString()}
                      </p>
                      {editMode && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <Camera size={16} className="mr-2" />
                          Change Photo
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Name"
                      icon={<User size={16} />}
                      error={formik.errors.name}
                      touched={formik.touched.name}
                      required
                    >
                      <Input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-50" : ""}
                      />
                    </FormField>

                    <FormField
                      label="Email Address"
                      icon={<Mail size={16} />}
                      error={formik.errors.email}
                      touched={formik.touched.email}
                      required
                    >
                      <Input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={true}
                        className={
                          !editMode ? "bg-gray-50" : "cursor-not-allowed"
                        }
                      />
                    </FormField>

                    <FormField
                      label="Phone Number"
                      icon={<Phone size={16} />}
                      error={formik.errors.phone}
                      touched={formik.touched.phone}
                      required
                    >
                      <Input
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-50" : ""}
                        maxLength={10}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Address"
                    icon={<MapPin size={16} />}
                    error={formik.errors.address}
                    touched={formik.touched.address}
                    required
                  >
                    <Textarea
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!editMode}
                      className={!editMode ? "bg-gray-50" : ""}
                      rows={3}
                    />
                  </FormField>

                  {editMode && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formik.isValid}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Save size={16} />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Booking Stats */}
            <Card className="shadow-lg border-0 p-0">
              <CardHeader className="bg-gradient-to-r p-2 flex items-center from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Home size={20} />
                  Booking Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bookings</span>
                  <span
                    className="font-bold text-2xl"
                    style={{ color: colors.primary }}
                  >
                    {bookingStats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-blue-600">
                    {bookingStats.confirmed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {bookingStats.completed}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: colors.primary }}
                    >
                      ₹{bookingStats.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Stats */}
            <Card className="shadow-lg border-0 p-0">
              <CardHeader className="bg-gradient-to-r p-2 flex items-center from-pink-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart size={20} />
                  Favourites
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5 flex items-center justify-center">
                {/* <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bookings</span>
                  <span
                    className="font-bold text-2xl"
                    style={{ color: colors.primary }}
                  >
                    {bookingStats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold text-blue-600">
                    {bookingStats.confirmed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {bookingStats.completed}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span
                      className="font-bold text-lg"
                      style={{ color: colors.primary }}
                    >
                      ₹{bookingStats.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div> */}
                <Button style={{ backgroundColor: colors.primary }}>
                  Go to favourites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking History */}
        <div className="mt-12">
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r p-2 flex items-center from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar size={24} />
                My Bookings ({sampleBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sampleBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Home size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    No bookings yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start exploring amazing properties to make your first
                    booking!
                  </p>
                  <Button style={{ backgroundColor: colors.primary }}>
                    Browse Properties
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sampleBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
