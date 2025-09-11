import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Info,
  Home,
  Phone,
  SquareDashed,
  LucideExternalLink,
  ChevronDown,
  LucideEdit,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { colors } from "@/utils/colors";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/about", label: "About", icon: <Info size={16} /> },
  { to: "/listings", label: "Listings", icon: <Home size={16} /> },
  { to: "/contact", label: "Contact", icon: <Phone size={16} /> },
];

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    setIsProfileDropdownOpen(false);
    setIsSheetOpen(false);
    navigate("/");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  // Get user initials for profile button
  const getUserInitials = () => {
    if (!user?.user?.username) return "U";
    return user.user.username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white border-b h-16 flex items-center justify-center">
        <div className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </nav>
    );
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white border-b shadow-sm"
      style={{ borderColor: colors.border }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Name */}
          <NavLink to="/" className="flex items-center gap-2 select-none">
            <img
              src="/logo.png"
              alt="Nest Logo"
              className="h-7 w-7 object-contain"
              draggable={false}
            />
            <span
              className="text-2xl font-bold self-end relative"
              style={{ color: colors.primary }}
            >
              Nest
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive ? "" : "hover:bg-gray-100"
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? colors.primary : colors.muted,
                  backgroundColor: isActive
                    ? colors.lightPrimary
                    : "transparent",
                })}
              >
                {React.cloneElement(icon, { className: "stroke-current" })}
                {label}
              </NavLink>
            ))}

            <div className="flex items-center gap-2">
              {/* Not logged in */}
              {!user && (
                <NavLink to="/login">
                  <Button
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200"
                    style={{ backgroundColor: colors.primary, fontSize: 14 }}
                  >
                    <User size={16} />
                    Login
                  </Button>
                </NavLink>
              )}

              {/* Profile Dropdown for logged in users */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  >
                    {/* Profile Circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {getUserInitials()}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                      style={{ color: colors.muted }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b bg-blue-50">
                        <div
                          className="font-medium uppercase"
                          style={{ color: colors.dark }}
                        >
                          {user.user?.username || "User"}
                        </div>
                        <div className="text-xs text-blue-700 capitalize">
                          {user.user?.role || "Member"}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {user.user?.role === "user" && (
                          <NavLink
                            to="/user/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            style={{ color: colors.dark }}
                          >
                            <User size={16} />
                            Profile
                          </NavLink>
                        )}

                        {user.user?.role === "owner" && (
                          <NavLink
                            to="/owner"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            style={{ color: colors.dark }}
                          >
                            <SquareDashed size={16} />
                            Dashboard
                          </NavLink>
                        )}

                        {/* Change Password */}
                        {/* <NavLink
                          to="/change-password"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          style={{ color: colors.dark }}
                        >
                          <LucideEdit size={16} />
                          Change Password
                        </NavLink> */}

                        {/* Divider */}
                        <hr className="my-1" />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600 cursor-pointer"
                        >
                          <LucideExternalLink size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Profile Circle */}
            {user && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                style={{ backgroundColor: colors.primary }}
              >
                {getUserInitials()}
              </div>
            )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="inline-flex items-center justify-center rounded-md p-2 transition-colors focus:outline-none"
                  style={{ color: colors.muted }}
                >
                  <Menu size={28} />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80 p-4 [&>button]:hidden">
                <SheetHeader className="p-0">
                  <SheetTitle
                    className="flex items-center justify-between text-xl font-bold"
                    style={{ color: colors.dark }}
                  >
                    <div
                      className="flex items-center gap-2"
                      style={{ color: colors.primary }}
                    >
                      <img
                        src="/logo.png"
                        alt="Nest Logo"
                        className="h-7 w-7 object-contain"
                        draggable={false}
                      />
                      Nest
                    </div>
                    <SheetClose asChild>
                      <button
                        aria-label="Close menu"
                        className="rounded-md p-1 transition-colors focus:outline-none hover:bg-gray-100"
                        style={{ color: colors.muted }}
                      >
                        <X size={24} />
                      </button>
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile User Info Section */}
                {user && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg outline">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {getUserInitials()}
                      </div>
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: colors.dark }}
                        >
                          {user.user?.username || "User"}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {user.user?.role || "Member"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="mt-8 flex flex-col gap-2">
                  {navLinks.map(({ to, label, icon }) => (
                    <NavLink
                      key={label}
                      to={to}
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-100"
                      style={({ isActive }) => ({
                        color: isActive ? colors.primary : colors.dark,
                        backgroundColor: isActive
                          ? colors.lightPrimary
                          : "transparent",
                      })}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {React.cloneElement(icon, {
                        className: "stroke-current",
                      })}
                      {label}
                    </NavLink>
                  ))}
                </nav>

                {/* Auth Section */}
                <div className="mt-8 flex flex-col gap-2">
                  {!user ? (
                    <NavLink to="/login" onClick={() => setIsSheetOpen(false)}>
                      <Button
                        className="w-full justify-start gap-2 px-4 py-3 text-white"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <User size={16} />
                        Login
                      </Button>
                    </NavLink>
                  ) : (
                    <>
                      {/* User Profile/Dashboard Links */}
                      {user.user?.role === "user" && (
                        <NavLink
                          to="/user/profile"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 px-4 py-3 text-white"
                            style={{ background: colors.primary }}
                          >
                            <User size={16} />
                            Profile
                          </Button>
                        </NavLink>
                      )}

                      {user.user?.role === "owner" && (
                        <NavLink
                          to="/owner"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 px-4 py-3"
                          >
                            <SquareDashed size={16} />
                            Dashboard
                          </Button>
                        </NavLink>
                      )}

                      {/* Settings */}
                      {/* <NavLink
                        to="/settings"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 px-4 py-3"
                        >
                          <Settings size={16} />
                          Settings
                        </Button>
                      </NavLink> */}

                      {/* Logout */}
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start gap-2 px-4 py-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <LucideExternalLink size={16} />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
