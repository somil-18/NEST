import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, Info, Home, Phone, SquareDashed } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { colors } from "@/utils/colors"; // Updated to import from utils

const navLinks = [
  { to: "/about", label: "About", icon: <Info size={16} /> },
  { to: "/listings", label: "Listings", icon: <Home size={16} /> },
  { to: "/contact", label: "Contact", icon: <Phone size={16} /> },
];

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white border-b"
      style={{ borderColor: colors.border }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Name */}
          <NavLink to="/" className="flex items-center gap-2 select-none">
            <img
              src="https://imgs.search.brave.com/W3e7ENketSFhHPpNSOwXwdr-myxvrhIRfI6pWTHdAGk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vZDlkYTk3/NzliZjNhYjJhZjBi/NTBhMDY1Yjc4Yzg2/OWE0NjA3YWRmNC03/MjB4NzIwLndlYnA_/dz01MTImcT03MiZm/bT13ZWJw"
              alt="Nest Logo"
              className="h-12 w-12 object-contain"
              draggable={false}
            />
            <span className="text-xl font-bold" style={{ color: colors.dark }}>
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
                    isActive ? "" : ""
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? colors.primary : colors.muted,
                  backgroundColor: isActive
                    ? colors.lightPrimary
                    : "transparent",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.getAttribute("aria-current")) {
                    e.currentTarget.style.color = colors.primary;
                    e.currentTarget.style.backgroundColor = colors.lightPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.getAttribute("aria-current")) {
                    e.currentTarget.style.color = colors.muted;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {React.cloneElement(icon, { className: "stroke-current" })}
                {label}
              </NavLink>
            ))}
            {!user && (
              <NavLink to="/login">
                <Button
                  className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                  style={{ backgroundColor: colors.primary, fontSize: 14 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  <User size={16} />
                  Login
                </Button>
              </NavLink>
            )}
            {user && user?.role === "user" && (
              <NavLink to="/profile">
                <Button
                  className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                  style={{ backgroundColor: colors.primary, fontSize: 14 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  <User size={16} />
                  Profile
                </Button>
              </NavLink>
            )}
            {user && user?.role === "owner" && (
              <NavLink to="/owner">
                <Button
                  className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                  style={{ backgroundColor: colors.primary, fontSize: 14 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  <SquareDashed size={16} />
                  Dashboard
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="inline-flex items-center justify-center rounded-md p-2 transition-colors focus:outline-none"
                  style={{ color: colors.muted }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = colors.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = colors.muted)
                  }
                >
                  <Menu size={28} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-4 [&>button]:hidden">
                <SheetHeader className="p-0">
                  <SheetTitle
                    className="flex items-center gap-2 text-xl font-bold"
                    style={{ color: colors.dark }}
                  >
                    <div className="flex items-center">
                      <img
                        src="https://imgs.search.brave.com/W3e7ENketSFhHPpNSOwXwdr-myxvrhIRfI6pWTHdAGk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vZDlkYTk3/NzliZjNhYjJhZjBi/NTBhMDY1Yjc4Yzg2/OWE0NjA3YWRmNC03/MjB4NzIwLndlYnA_/dz01MTImcT03MiZm/bT13ZWJw"
                        alt="Nest Logo"
                        className="h-14 w-14 object-contain"
                      />
                      Nest
                    </div>
                    <SheetClose asChild>
                      <button
                        aria-label="Close menu"
                        className="absolute top-7 right-4 rounded-md p-1 transition-colors focus:outline-none"
                        style={{ color: colors.muted }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = colors.primary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = colors.muted)
                        }
                      >
                        <X size={24} />
                      </button>
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  {navLinks.map(({ to, label, icon }) => (
                    <NavLink
                      key={label}
                      to={to}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      style={({ isActive }) => ({
                        color: isActive ? colors.primary : colors.muted,
                        backgroundColor: isActive
                          ? colors.lightPrimary
                          : "transparent",
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.getAttribute("aria-current")) {
                          e.currentTarget.style.color = colors.primary;
                          e.currentTarget.style.backgroundColor =
                            colors.lightPrimary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.getAttribute("aria-current")) {
                          e.currentTarget.style.color = colors.muted;
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {React.cloneElement(icon, {
                        className: "stroke-current",
                      })}
                      {label}
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-8">
                  {!user && (
                    <NavLink to="/login">
                      <Button
                        className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                        style={{
                          backgroundColor: colors.primary,
                          fontSize: 14,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.accent)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.primary)
                        }
                      >
                        <User size={16} />
                        Login
                      </Button>
                    </NavLink>
                  )}
                  {user && user?.role === "user" && (
                    <NavLink to="/profile">
                      <Button
                        className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                        style={{
                          backgroundColor: colors.primary,
                          fontSize: 14,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.accent)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.primary)
                        }
                      >
                        <User size={16} />
                        Profile
                      </Button>
                    </NavLink>
                  )}
                  {user && user?.role === "owner" && (
                    <NavLink to="/owner">
                      <Button
                        className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                        style={{
                          backgroundColor: colors.primary,
                          fontSize: 14,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.accent)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.primary)
                        }
                      >
                        <SquareDashed size={16} />
                        Dashboard
                      </Button>
                    </NavLink>
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
