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
import { AlertCircle, Eye, EyeOff, Lock, Check, X, Shield } from "lucide-react";
import { colors } from "@/utils/colors";

// Validation Schema
const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),

  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[a-z])/, "Must contain at least one lowercase letter")
    .matches(/(?=.*[A-Z])/, "Must contain at least one uppercase letter")
    .matches(/(?=.*\d)/, "Must contain at least one number")
    .matches(/(?=.*[@$!%*?&])/, "Must contain at least one special character")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password must be different from current password"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
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
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      try {
        // Simulate API call - Replace with actual API endpoint
        // const response = await fetch('/api/change-password', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${authToken}`
        //   },
        //   body: JSON.stringify({
        //     currentPassword: values.currentPassword,
        //     newPassword: values.newPassword
        //   })
        // });

        // if (!response.ok) {
        //   throw new Error('Failed to change password');
        // }

        // Demo simulation
        setTimeout(() => {
          console.log("Password change request:", {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });

          // Reset form and close modal
          resetForm();
          setIsSubmitting(false);
          onClose();

          alert("Password changed successfully! Please log in again.");
        }, 2000);
      } catch (error) {
        console.error("Password change error:", error);
        setIsSubmitting(false);
        alert("Failed to change password. Please try again.");
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
            name="currentPassword"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.currentPassword}
            touched={formik.touched.currentPassword}
            placeholder="Enter your current password"
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.newPassword}
            touched={formik.touched.newPassword}
            placeholder="Enter your new password"
            showStrengthIndicator={true}
          />

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
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
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
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
