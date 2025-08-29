import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { colors } from "@/utils/colors";
import { Link } from "react-router-dom";
import ForgotPasswordDialog from "./ForgotPasswordDialog";

// Yup validation schema for login
const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const loginInitialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      console.log("Login Values:", values);
      // Handle login submission here - API call, authentication, etc.
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: colors.light }}
    >
      <div
        className="max-w-md w-full bg-white rounded-lg p-10 shadow-lg"
        style={{ border: `1px solid ${colors.border}` }}
      >
        <h2
          className="text-3xl font-semibold mb-8 text-center tracking-tight"
          style={{ color: colors.dark }}
        >
          Welcome back
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          {/* Email Field */}
          <div>
            <Label
              htmlFor="email"
              className="block mb-2 font-medium"
              style={{ color: colors.dark }}
            >
              Email <span style={{ color: colors.error }}>*</span>
            </Label>
            <div className="relative">
              <span
                className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                style={{ color: colors.primary }}
              >
                <Mail size={20} />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-10 w-full rounded border outline-none transition-colors"
                style={{ 
                  backgroundColor: colors.light,
                  color: colors.dark,
                  borderColor: formik.touched.email && formik.errors.email ? colors.error : colors.border
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.borderColor = formik.touched.email && formik.errors.email ? colors.error : colors.border;
                }}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm" style={{ color: colors.error }}>
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label
              htmlFor="password"
              className="block mb-2 font-medium"
              style={{ color: colors.dark }}
            >
              Password <span style={{ color: colors.error }}>*</span>
            </Label>
            <div className="relative">
              <span
                className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                style={{ color: colors.secondary }}
              >
                <Lock size={20} />
              </span>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-10 pr-10 w-full rounded border outline-none transition-colors"
                style={{ 
                  backgroundColor: colors.light,
                  color: colors.dark,
                  borderColor: formik.touched.password && formik.errors.password ? colors.error : colors.border
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.borderColor = formik.touched.password && formik.errors.password ? colors.error : colors.border;
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 flex items-center transition-colors"
                style={{ color: colors.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
              >
                {showPassword ? (
                  <EyeOff size={20} className="cursor-pointer" />
                ) : (
                  <Eye size={20} className="cursor-pointer" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm" style={{ color: colors.error }}>
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <ForgotPasswordDialog />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-white text-lg transition-colors duration-200"
            style={{ backgroundColor: colors.primary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.accent)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = colors.primary)
            }
          >
            Sign In
          </Button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm" style={{ color: colors.muted }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium underline transition-colors"
            style={{ color: colors.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
