import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { colors } from "@/utils/colors";

// Yup validation schema for forgot password
const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { resetForm }) => {
      // Simulate API call
      console.log("Forgot Password Email:", values.email);

      // Show success toast
      toast.success("Reset link shared to your mail", {
        description: "Please check your email for password reset instructions.",
        duration: 4000,
      });

      // Reset form and close modal
      resetForm();
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm font-medium cursor-pointer text-red-600 hover:text-blue-400 underline transition-colors"
        >
          Forgot your password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-semibold text-center"
            style={{ color: colors.black }}
          >
            Reset your password
          </DialogTitle>
        </DialogHeader>
        <div>
          <DialogDescription
            className={"text-sm text-gray-600 text-center mb-6"}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </DialogDescription>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="forgot-email"
                className="block mb-2 font-medium"
                style={{ color: colors.black }}
              >
                Email <span className="text-red-600">*</span>
              </Label>
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
                  style={{ color: colors.red }}
                >
                  <Mail size={20} color={colors.black} />
                </span>
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`pl-10 w-full rounded border ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-700 outline-none transition-colors`}
                  style={{ backgroundColor: colors.lightBlue }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.borderColor =
                      formik.touched.email && formik.errors.email
                        ? "#ef4444"
                        : "#d1d5db";
                  }}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-2 px-4 rounded-md font-semibold text-white transition-colors duration-200"
                style={{ backgroundColor: colors.red }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.blue)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.red)
                }
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
