import { colors } from "@/utils/colors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, Eye, EyeOff, Loader2, Lock, XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Password Reset Dialog Component
const PasswordResetDialog = ({ isOpen, token, userEmail }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Simulate API call to reset password
  const resetPassword = async (token, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token && newPassword) {
          resolve({
            success: true,
            message: "Password has been reset successfully!",
          });
        } else {
          reject({
            success: false,
            message: "Failed to reset password. Please try again.",
          });
        }
      }, 1500);
    });
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);
        const response = await resetPassword(token, values.password);

        // Show success message
        setStatus({
          type: "success",
          message: response.message,
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Password reset successful! Please login with your new password.",
            },
          });
        }, 2000);
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error.message || "Failed to reset password. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen max-w-md bg-gray-50 flex items-center justify-center px-6">
      <Dialog open={isOpen}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.lightPrimary }}
              >
                <Lock size={24} style={{ color: colors.primary }} />
              </div>
            </div>
            <DialogTitle
              className="text-2xl font-bold"
              style={{ color: colors.dark }}
            >
              Reset Your Password
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {userEmail && (
                <span>
                  Create a new password for <strong>{userEmail}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Status Messages */}
            {formik.status && (
              <Alert
                className={`${
                  formik.status.type === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {formik.status.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={
                    formik.status.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {formik.status.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pr-10 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pr-10 ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-xs text-red-600">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full py-3"
                style={{ backgroundColor: colors.primary }}
              >
                {formik.isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </form>

          <div className="text-center text-xs text-gray-500 mt-4">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline hover:text-blue-600"
              style={{ color: colors.primary }}
            >
              Back to Login
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordResetDialog;
