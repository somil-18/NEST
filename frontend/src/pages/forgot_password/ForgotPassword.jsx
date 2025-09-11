import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/owner/FormField";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/utils/constants";
import { colors } from "@/utils/colors";

// Validation Schema
const forgotPasswordSchema = Yup.object({
  new_password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { token } = useParams();

  const formik = useFormik({
    initialValues: {
      new_password: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await axios.post(
          `${API_URL}/reset-password/${token}`,
          {
            new_password: values.new_password,
          }
        );

        if (response.data?.success) {
          setIsSuccess(true);
          toast.success("Password reset successfully!");

          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(response.data?.message || "Failed to reset password");
        }
      } catch (error) {
        console.error("Error resetting password:", error);

        if (error.response?.data?.message) {
          toast.error(
            error.response?.data?.message ||
              "Failed to reset password. Please try again."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formik.values.new_password);
  const strengthColors = [
    "bg-red-500",
    "bg-red-400",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-500",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You will be
              redirected to the login page shortly.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Redirecting to login...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-white p-2"
            style={{ backgroundColor: colors.primary }}
          >
            <ArrowLeft size={20} />
            Back to Login
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 overflow-hidden p-0">
          <CardHeader
            className="text-white py-4 text-center"
            style={{
              background: colors.primary,
            }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Reset Your Password
            </CardTitle>
            <p className="text-white/90 text-sm mt-2">
              Enter your new password below to secure your account
            </p>
          </CardHeader>

          <CardContent className="px-8 py-3">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <FormField
                label="New Password"
                error={formik.errors.new_password}
                touched={formik.touched.new_password}
                required
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="new_password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.new_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your new password"
                    className="pl-10 pr-10 py-3 text-base"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Password Strength Indicator */}
              {formik.values.new_password && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Password Strength
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength >= 4
                          ? "text-green-600"
                          : passwordStrength >= 3
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {strengthLabels[passwordStrength - 1] || "Very Weak"}
                    </span>
                  </div>

                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength - 1] ||
                              "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Password Requirements */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          formik.values.new_password.length >= 8
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          formik.values.new_password.length >= 8
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /[A-Z]/.test(formik.values.new_password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          /[A-Z]/.test(formik.values.new_password)
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /[a-z]/.test(formik.values.new_password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          /[a-z]/.test(formik.values.new_password)
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /\d/.test(formik.values.new_password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          /\d/.test(formik.values.new_password)
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        One number
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /[@$!%*?&]/.test(formik.values.new_password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          /[@$!%*?&]/.test(formik.values.new_password)
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        One special character (@$!%*?&)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isSubmitting || !formik.isValid || !formik.values.new_password
                }
                className="w-full py-3 text-base font-semibold text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    isSubmitting || !formik.isValid
                      ? colors.primary
                      : colors.accent,
                }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Password...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Shield size={18} />
                    Update Password
                  </div>
                )}
              </Button>
            </form>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Security Tip</p>
                  <p>Choose a strong password..</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 underline cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
