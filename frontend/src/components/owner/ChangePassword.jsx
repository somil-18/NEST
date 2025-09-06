import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, Lock, Check, Shield } from "lucide-react";
import { colors } from "@/utils/colors";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Validation Schema with snake_case field names
const changePasswordValidationSchema = Yup.object({
  old_password: Yup.string().required("Current password is required"),

  new_password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[a-z])/, "Must contain at least one lowercase letter")
    .matches(/(?=.*[A-Z])/, "Must contain at least one uppercase letter")
    .matches(/(?=.*\d)/, "Must contain at least one number")
    .matches(/(?=.*[@$!%*?&])/, "Must contain at least one special character")
    .notOneOf(
      [Yup.ref("old_password")],
      "New password must be different from current password"
    ),

  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

// Password Strength Indicator Component
const PasswordStrength = ({ password }) => {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /(?=.*[a-z])/, text: "One lowercase letter" },
    { regex: /(?=.*[A-Z])/, text: "One uppercase letter" },
    { regex: /(?=.*\d)/, text: "One number" },
    { regex: /(?=.*[@$!%*?&])/, text: "One special character" },
  ];

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-gray-200";
    if (score <= 2) return "bg-red-500";
    if (score <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const score = requirements.reduce(
    (acc, req) => (req.regex.test(password) ? acc + 1 : acc),
    0
  );

  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-3">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Password Strength:</span>
        <span
          className={`font-medium ${
            score === 0
              ? "text-gray-500"
              : score <= 2
              ? "text-red-600"
              : score <= 4
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {password ? strengthText[score] : ""}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
            score
          )}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                req.regex.test(password) ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              {req.regex.test(password) && (
                <Check size={8} className="text-white" />
              )}
            </div>
            <span
              className={
                req.regex.test(password) ? "text-green-600" : "text-gray-500"
              }
            >
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form Field Component
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  showStrengthIndicator = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-800"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`pr-10 ${
            error && touched ? "border-red-500 focus:border-red-500" : ""
          }`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        >
          {showPassword ? (
            <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye size={16} className="text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
      {error && touched && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      {showStrengthIndicator && value && <PasswordStrength password={value} />}
    </div>
  );
};

// Main Change Password Modal Component
export default function ChangePassword({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      try {
        const response = await axios.post(
          `${API_URL}/change-password`,
          {
            old_password: values.old_password,
            new_password: values.new_password,
            confirm_password: values.confirm_password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data?.success) {
          toast.success("🎉 Password changed successfully!", {
            description: "Please log in again with your new password",
            duration: 5000,
          });
          resetForm();
          onClose();

          // Optional: Redirect to login after delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          toast.error("❌ Failed to change password", {
            description:
              response.data?.message ||
              "Please check your current password and try again",
          });
        }
      } catch (error) {
        console.error("Password change error:", error);
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        toast.error("❌ Password change failed", {
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      formik.resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.lightPrimary }}
            >
              <Shield size={20} style={{ color: colors.primary }} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Change Password
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Update your account password to keep it secure
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <PasswordField
            label="Current Password"
            name="old_password"
            value={formik.values.old_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.old_password}
            touched={formik.touched.old_password}
            placeholder="Enter your current password"
          />

          <PasswordField
            label="New Password"
            name="new_password"
            value={formik.values.new_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.new_password}
            touched={formik.touched.new_password}
            placeholder="Enter your new password"
            showStrengthIndicator={true}
          />

          <PasswordField
            label="Confirm New Password"
            name="confirm_password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirm_password}
            touched={formik.touched.confirm_password}
            placeholder="Confirm your new password"
          />

          <DialogFooter className="pt-6 border-t">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !formik.isValid || formik.isSubmitting || isSubmitting
                }
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Changing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Change Password
                  </div>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
