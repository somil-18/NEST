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
// import { toast } from "sonner";
import { Mail } from "lucide-react";
import { colors } from "@/utils/colors";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Yup validation schema for forgot password
const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("Sending mail");
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/forgot-password`, values);
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

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
          className="text-sm font-medium cursor-pointer underline transition-colors"
          style={{ color: colors.primary }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.primary)}
        >
          Forgot your password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-semibold text-center"
            style={{ color: colors.dark }}
          >
            Reset your password
          </DialogTitle>
        </DialogHeader>
        <div>
          <DialogDescription
            className="text-sm text-center mb-6"
            style={{ color: colors.muted }}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </DialogDescription>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="forgot-email"
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
                      : ""
                  } outline-none transition-colors`}
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                style={{
                  borderColor: colors.border,
                  color: colors.muted,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.light)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 disabled:cursor-not-allowed rounded-md font-semibold text-white transition-colors duration-200"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.primary)
                }
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
