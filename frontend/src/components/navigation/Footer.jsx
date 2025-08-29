import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { colors } from "@/utils/colors";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
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

  const socialLinks = [
    { icon: <Facebook size={20} />, to: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, to: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, to: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, to: "#", label: "LinkedIn" },
  ];

  return (
    <footer
      className="bg-white border-t"
      style={{ borderColor: colors.lightBlack }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="https://imgs.search.brave.com/W3e7ENketSFhHPpNSOwXwdr-myxvrhIRfI6pWTHdAGk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vZDlkYTk3/NzliZjNhYjJhZjBi/NTBhMDY1Yjc4Yzg2/OWE0NjA3YWRmNC03/MjB4NzIwLndlYnA_/dz01MTImcT03MiZm/bT13ZWJw"
                alt="Nest Logo"
                className="h-12 w-12 object-contain"
                draggable={false}
              />
              <span
                className="text-xl font-bold"
                style={{ color: colors.black }}
              >
                Nest
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Find your perfect PG accommodation with ease. We connect tenants
              with verified property owners for safe, comfortable, and
              affordable living spaces.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} style={{ color: colors.red }} />
                <Link
                  to="mailto:support@nest.com"
                  className="hover:text-primary transition-colors"
                >
                  support@nest.com
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} style={{ color: colors.blue }} />
                <Link
                  to="tel:+919876543210"
                  className="hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} style={{ color: colors.black }} />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: colors.black }}
            >
              Company
            </h3>
            <nav className="flex flex-col space-y-2">
              {footerLinks.company.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: colors.black }}
            >
              Services
            </h3>
            <nav className="flex flex-col space-y-2">
              {footerLinks.services.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: colors.black }}
            >
              Support
            </h3>
            <nav className="flex flex-col space-y-2">
              {footerLinks.support.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: colors.black }}
            >
              Legal
            </h3>
            <nav className="flex flex-col space-y-2">
              {footerLinks.legal.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Nest. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground mr-2">
              Follow us:
            </span>
            <div className="flex gap-2">
              {socialLinks.map(({ icon, to, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  <a
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    {icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
