/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
  AlertCircle,
  Camera,
  Heart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors } from "@/utils/colors";
import { profileValidationSchema } from "@/yup/profileValidationSchema";
import ChangePassword from "@/components/user/ChangePassword";
import axios from "axios";
import { API_URL } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BookingCard from "@/components/user/BookingCard";

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

// Main Profile Component
export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)

  const formik = useFormik({
    initialValues: {
      username: userData?.username || "",
      email: userData?.email || "",
      mobile_no: userData?.mobile_no || "",
      bio: userData?.bio || "",
      address: userData?.address || "",
      gender: userData?.gender || "",
      age: userData?.age || "",
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      await handleSaveProfile(values);
    },
  });

  // API call to save profile data
  const handleSaveProfile = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`${API_URL}/profile`, values);
      console.log(response);

      if (response.data?.success) {
        // Update local state with new data
        setUserData({ ...userData, ...values });
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle header save button click
  const handleHeaderSaveClick = async () => {
    if (formik.isValid) {
      await handleSaveProfile(formik.values);
    } else {
      // Trigger validation to show errors
      formik.setTouched({
        username: true,
        email: true,
        mobile_no: true,
        bio: true,
        address: true,
        gender: true,
        age: true,
      });
    }
  };

  const onCancel = (id) => {
    setBookings((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = user?.access_token;
        console.log(token)
        if (!token) {
          toast.error("User not authenticated");
          return;
        }
        setLoading(true);
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        if (response.data?.success) {
          setUserData(response.data.data);
          setBookings(response.data.data.my_bookings || []);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch profile data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleCancelEdit = () => {
    formik.resetForm();
    setEditMode(false);
  };

  const getUserInitials = () => {
    if (!userData?.username) return "U";
    return userData.username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate appointment statistics
  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter((a) => a.status === "Confirmed").length,
    pending: bookings.filter((a) => a.status === "Pending").length,
    cancelled: bookings.filter((a) => a.status === "Cancelled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-gray-600 hidden sm:block">
            Manage your account information and view appointment history
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
                        <X size={16} />
                        Cancel
                      </Button>
                    )}
                    {editMode ? (
                      <Button
                        onClick={handleHeaderSaveClick}
                        disabled={isSubmitting}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditMode(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <Edit3 size={16} className="mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userData?.profile_image_url} />
                      <AvatarFallback
                        className="text-white text-2xl font-bold"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {userData?.username || "User"}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {userData?.role || "Member"}{" "}
                        {userData?.gender && "• " + userData?.gender}
                        {userData?.age && ", " + userData?.age + " yrs"}
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
                      label="Username"
                      icon={<User size={16} />}
                      error={formik.errors.username}
                      touched={formik.touched.username}
                      required
                    >
                      <Input
                        name="username"
                        value={formik.values.username}
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
                        className="bg-gray-50 cursor-not-allowed"
                      />
                    </FormField>

                    <FormField
                      label="Mobile Number"
                      icon={<Phone size={16} />}
                      error={formik.errors.mobile_no}
                      touched={formik.touched.mobile_no}
                      required
                    >
                      <Input
                        name="mobile_no"
                        value={formik.values.mobile_no}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-50" : ""}
                        maxLength={10}
                      />
                    </FormField>

                    <FormField
                      label="Gender"
                      icon={<Users size={16} />}
                      error={formik.errors.gender}
                      touched={formik.touched.gender}
                    >
                      <select
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!editMode}
                        className={`w-full p-2 border rounded-md ${
                          !editMode ? "bg-gray-50" : ""
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormField>

                    <FormField
                      label="Age"
                      icon={<Calendar size={16} />}
                      error={formik.errors.age}
                      touched={formik.touched.age}
                    >
                      <Input
                        name="age"
                        type="number"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!editMode}
                        className={!editMode ? "bg-gray-50" : ""}
                        min="18"
                        max="100"
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Bio"
                    icon={<User size={16} />}
                    error={formik.errors.bio}
                    touched={formik.touched.bio}
                  >
                    <Textarea
                      name="bio"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!editMode}
                      className={!editMode ? "bg-gray-50" : ""}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </FormField>

                  <FormField
                    label="Address"
                    icon={<MapPin size={16} />}
                    error={formik.errors.address}
                    touched={formik.touched.address}
                  >
                    <Textarea
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!editMode}
                      className={!editMode ? "bg-gray-50" : ""}
                      rows={3}
                      placeholder="Enter your address..."
                    />
                  </FormField>

                  {/* Bottom Save Button */}
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
            {/* Appointment Stats */}
            <Card className="shadow-lg border-0 p-0">
              <CardHeader className="bg-gradient-to-r p-2 flex items-center from-green-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
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
                  <span className="font-semibold text-green-600">
                    {bookingStats.confirmed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {bookingStats.pending}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">
                    {bookingStats.cancelled}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Favourites Card */}
            <Card className="shadow-lg border-0 p-0">
              <CardHeader className="bg-gradient-to-r p-2 flex items-center from-pink-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart size={20} />
                  Favourites
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5 flex items-center justify-center">
                <Button
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => navigate("/user/favourites")}
                >
                  Go to favourites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bookings History */}
        <div className="mt-12">
          <Card className="shadow-lg border-0 p-0">
            <CardHeader className="bg-gradient-to-r p-2 flex items-center from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar size={24} />
                My Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    No bookings yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start exploring properties and book listings!
                  </p>
                  <Button
                    style={{ backgroundColor: colors.primary }}
                    onClick={() => navigate("/listings")}
                  >
                    Browse Properties
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((appointment) => (
                    <BookingCard
                      onCancel={onCancel}
                      key={appointment.id}
                      appointment={appointment}
                    />
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
