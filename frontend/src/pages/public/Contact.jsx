import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui//input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { colors } from "@/utils/colors";
import { toast } from "sonner";

// Animation hook for one-time animations
const useInViewOnce = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref || hasAnimated) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAnimated(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, hasAnimated, options]);

  return [setRef, hasAnimated];
};

// Animated Section Component
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const [ref, hasAnimated] = useInViewOnce({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: hasAnimated ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  subject: Yup.string()
    .min(3, "Subject must be at least 3 characters")
    .required("Subject is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
});

const initialValues = {
  email: "",
  subject: "",
  description: "",
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Contact form submitted:", values);

      // Show success toast
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
        duration: 4000,
      });

      resetForm();
      setIsSubmitting(false);
    },
  });

  const contactInfo = [
    {
      icon: <Mail />,
      title: "Email",
      content: "support@nest.com",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone />,
      title: "Phone",
      content: "+91 98765 43210",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: <MapPin />,
      title: "Office",
      content: "Mumbai, Maharashtra",
      description: "Come say hello at our HQ",
    },
    {
      icon: <Clock />,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We respond quickly",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <Badge
              className="mb-6 px-4 py-2"
              style={{ backgroundColor: colors.lightPrimary }}
            >
              <span style={{ color: colors.primary }}>Contact Us</span>
            </Badge>
            <h1
              className="text-5xl md:text-6xl font-bold mb-8"
              style={{ color: colors.dark }}
            >
              Get in
              <span className="block" style={{ color: colors.primary }}>
                Touch
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl max-w-3xl mx-auto"
              style={{ color: colors.muted }}
            >
              Have a question or need help? We're here to assist you with any
              inquiries about our platform and services.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.lightPrimary }}
                  >
                    {React.cloneElement(info.icon, {
                      size: 24,
                      color: colors.primary,
                    })}
                  </div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: colors.dark }}
                  >
                    {info.title}
                  </h3>
                  <p
                    className="font-medium mb-1"
                    style={{ color: colors.primary }}
                  >
                    {info.content}
                  </p>
                  <p className="text-sm" style={{ color: colors.muted }}>
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection delay={200}>
            <Card className="shadow-2xl">
              <CardContent className="p-10">
                <div className="text-center mb-10">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.lightPrimary }}
                  >
                    <MessageSquare
                      size={32}
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: colors.dark }}
                  >
                    Send us a Message
                  </h2>
                  <p className="text-lg" style={{ color: colors.muted }}>
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>

                <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-6"
                  noValidate
                >
                  {/* Email Field */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="block mb-2 font-medium"
                      style={{ color: colors.dark }}
                    >
                      Email Address{" "}
                      <span style={{ color: colors.error }}>*</span>
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
                        placeholder="your.email@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pl-12 outline-none transition-colors"
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
                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.error }}
                      >
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <Label
                      htmlFor="subject"
                      className="block mb-2 font-medium"
                      style={{ color: colors.dark }}
                    >
                      Subject <span style={{ color: colors.error }}>*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="outline-none transition-colors"
                      style={{
                        backgroundColor: colors.light,
                        color: colors.dark,
                        borderColor:
                          formik.touched.subject && formik.errors.subject
                            ? colors.error
                            : colors.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = "none";
                        e.currentTarget.style.borderColor =
                          formik.touched.subject && formik.errors.subject
                            ? colors.error
                            : colors.border;
                      }}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.error }}
                      >
                        {formik.errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div>
                    <Label
                      htmlFor="description"
                      className="block mb-2 font-medium"
                      style={{ color: colors.dark }}
                    >
                      Message <span style={{ color: colors.error }}>*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="resize-none outline-none transition-colors"
                      style={{
                        backgroundColor: colors.light,
                        color: colors.dark,
                        borderColor:
                          formik.touched.description &&
                          formik.errors.description
                            ? colors.error
                            : colors.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = "none";
                        e.currentTarget.style.borderColor =
                          formik.touched.description &&
                          formik.errors.description
                            ? colors.error
                            : colors.border;
                      }}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: colors.error }}
                        >
                          {formik.errors.description}
                        </p>
                      )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 text-lg font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-lg hover:scale-[1.02]"
                    }`}
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) =>
                      !isSubmitting &&
                      (e.currentTarget.style.backgroundColor = colors.accent)
                    }
                    onMouseLeave={(e) =>
                      !isSubmitting &&
                      (e.currentTarget.style.backgroundColor = colors.primary)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                {/* Success State */}
                <div
                  className="mt-8 p-4 rounded-lg text-center"
                  style={{ backgroundColor: colors.lightPrimary }}
                >
                  <CheckCircle
                    size={20}
                    className="inline mr-2"
                    style={{ color: colors.success }}
                  />
                  <span className="text-sm" style={{ color: colors.dark }}>
                    We typically respond within 24 hours
                  </span>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection delay={400}>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-lg mb-12" style={{ color: colors.muted }}>
              Quick answers to questions you may have. Can't find what you're
              looking for?{" "}
              <span style={{ color: colors.primary }}>
                Contact our support team.
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: "How do I list my property?",
                  a: "Simply create an account and use our easy listing form to add your property details.",
                },
                {
                  q: "Is verification mandatory?",
                  a: "Yes, all properties go through our verification process to ensure quality and safety.",
                },
                {
                  q: "What are the fees?",
                  a: "We offer competitive pricing with transparent fees. Contact us for detailed pricing information.",
                },
                {
                  q: "How do I contact support?",
                  a: "You can reach us via this contact form, email, or phone during business hours.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="text-left hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <h3
                      className="font-semibold mb-3"
                      style={{ color: colors.primary }}
                    >
                      {faq.q}
                    </h3>
                    <p style={{ color: colors.muted }}>{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
