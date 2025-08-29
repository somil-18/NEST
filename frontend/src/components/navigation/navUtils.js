import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export const footerLinks = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Our Mission", to: "/mission" },
    { label: "Careers", to: "/careers" },
    { label: "Press", to: "/press" },
  ],
  services: [
    { label: "For Tenants", to: "/tenants" },
    { label: "For Owners", to: "/owners" },
    { label: "Property Management", to: "/property-management" },
    { label: "Pricing", to: "/pricing" },
  ],
  support: [
    { label: "Help Center", to: "/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "FAQs", to: "/faqs" },
    { label: "Safety Guidelines", to: "/safety" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "Refund Policy", to: "/refunds" },
  ],
};

export const socialLinks = [
  { icon: Facebook, to: "#", label: "Facebook" },
  { icon: Twitter, to: "#", label: "Twitter" },
  { icon: Instagram, to: "#", label: "Instagram" },
  { icon: Linkedin, to: "#", label: "LinkedIn" },
];
