import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { colors } from "@/utils/colors";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Yup validation schema for login
const loginValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const loginInitialValues = {
  username: "",
  password: "",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      console.log("Login Values:", values);
      try {
        const response = await axios.post(`${API_URL}/login`, values);
        console.log(response);
        if(response?.data?.success){
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        if (response?.data?.role === "user") {
          navigate("/");
        } else if (response?.data?.role === "owner") {
          navigate("/owner");
        }
      } catch (error) {
        console.log(error);
      }
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
                style={{ color: colors.primary }}
              >
                <Mail size={20} />
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
