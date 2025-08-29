import React, { useState } from "react";
import { useFormik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { colors } from "@/utils/colors";
import {
  registrationInitialValues,
  registrationValidationSchema,
} from "@/yup/register";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: registrationInitialValues,
    validationSchema: registrationValidationSchema,
    onSubmit: (values) => {
      console.log("Form Values:", values);
      // Handle form submission here - API call, etc.
    },
  });

  const roles = [
    { id: "user", label: "User", color: colors.accent },
    { id: "owner", label: "Owner", color: colors.primary },
  ];

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
          Create your account
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
          {/* Username Field */}
          <div>
            <Label
              htmlFor="username"
              className="block mb-2 font-medium"
              style={{ color: colors.dark }}
            >
              Username <span style={{ color: colors.error }}>*</span>
            </Label>
            <div className="relative">
              <span
                className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                style={{ color: colors.accent }}
              >
                <User size={20} />
              </span>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Your username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pl-10 w-full rounded border outline-none transition-colors"
                style={{
                  backgroundColor: colors.light,
                  color: colors.dark,
                  borderColor:
                    formik.touched.username && formik.errors.username
                      ? colors.error
                      : colors.border,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.borderColor =
                    formik.touched.username && formik.errors.username
                      ? colors.error
                      : colors.border;
                }}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-sm" style={{ color: colors.error }}>
                {formik.errors.username}
              </p>
            )}
          </div>

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
                  borderColor:
                    formik.touched.email && formik.errors.email
                      ? colors.error
                      : colors.border,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.borderColor =
                    formik.touched.email && formik.errors.email
                      ? colors.error
                      : colors.border;
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
                  borderColor:
                    formik.touched.password && formik.errors.password
                      ? colors.error
                      : colors.border,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.borderColor =
                    formik.touched.password && formik.errors.password
                      ? colors.error
                      : colors.border;
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 flex items-center transition-colors"
                style={{ color: colors.muted }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.primary)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.muted)
                }
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

          {/* Role Selection - Custom Radio Chips */}
          <fieldset>
            <legend
              className="block mb-3 text-base font-semibold"
              style={{ color: colors.dark }}
            >
              Select Role
            </legend>
            <div className="flex gap-3">
              {roles.map(({ id, label, color }) => {
                const isSelected = formik.values.role === id;
                return (
                  <label
                    key={id}
                    htmlFor={`role-${id}`}
                    className="cursor-pointer select-none rounded-full border-2 py-1 font-medium transition-colors duration-200"
                    style={{
                      backgroundColor: isSelected ? color : "transparent",
                      borderColor: color,
                      color: isSelected ? "#fff" : colors.muted,
                      minWidth: "110px",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = color;
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.muted;
                      }
                    }}
                  >
                    <input
                      type="radio"
                      id={`role-${id}`}
                      name="role"
                      value={id}
                      className="hidden"
                      checked={isSelected}
                      onChange={() => formik.setFieldValue("role", id)}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
            {formik.touched.role && formik.errors.role && (
              <p
                className="mt-3 text-sm text-center"
                style={{ color: colors.error }}
              >
                {formik.errors.role}
              </p>
            )}
          </fieldset>

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
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm" style={{ color: colors.muted }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium underline transition-colors"
            style={{ color: colors.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
