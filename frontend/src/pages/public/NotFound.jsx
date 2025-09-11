import React from "react";
import { Link } from "react-router-dom";
import { Frown, Home as HomeIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colors } from "@/utils/colors";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-blue-100 px-6">
      <div className="max-w-xl w-full flex flex-col items-center text-center py-10">
        <div className="relative mb-4">
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 text-blue-300 select-none"
            style={{ fontSize: 200, fontWeight: "bold", zIndex: 0 }}
          >
            404
          </span>
          <Frown
            size={68}
            className="relative z-10 text-blue-400 drop-shadow-lg"
            style={{ marginBottom: -8 }}
          />
        </div>
        <h1
          className="text-5xl font-bold mb-6 mt-4"
          style={{ color: colors.dark }}
        >
          Oops! Page not found.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
          <br />
          <span className="block mt-2">Let’s get you back on track.</span>
        </p>
        <div className="flex flex-col gap-3 w-full justify-center items-center">
          <Button
            variant="default"
            size="lg"
            asChild
            className="w-52"
            style={{ backgroundColor: colors.primary }}
          >
            <Link to="/">
              <HomeIcon size={20} className="mr-2" />
              Go to Homepage
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="w-52 flex items-center justify-center border-2 border-blue-100 hover:bg-blue-50 transition"
            style={{ color: colors.primary }}
          >
            <Link to="/listings">
              <Search size={18} className="mr-2" />
              Browse Listings
            </Link>
          </Button>
        </div>
        <div className="mt-16 text-sm text-gray-400">
          If you believe this is an error, please{" "}
          <a
            href="mailto:support@yoursite.com"
            className="underline hover:text-blue-500"
          >
            contact support
          </a>
          .
        </div>
      </div>
    </div>
  );
}
