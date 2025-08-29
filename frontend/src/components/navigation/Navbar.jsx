import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, Info, Home, Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../ui/sheet"; // Adjust the import path as needed
import { Button } from "../ui/button";

const colors = {
  red: "#d64933",
  black: "#2b303a",
  blue: "#58a4b0",
};

const navLinks = [
  { to: "/about", label: "About", icon: <Info size={16} /> },
  { to: "/listings", label: "Listings", icon: <Home size={16} /> },
  { to: "/contact", label: "Contact", icon: <Phone size={16} /> },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Name */}
          <NavLink to="/" className="flex items-center gap-2 select-none">
            <img
              src="https://imgs.search.brave.com/W3e7ENketSFhHPpNSOwXwdr-myxvrhIRfI6pWTHdAGk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vZDlkYTk3/NzliZjNhYjJhZjBi/NTBhMDY1Yjc4Yzg2/OWE0NjA3YWRmNC03/MjB4NzIwLndlYnA_/dz01MTImcT03MiZm/bT13ZWJw"
              alt="Logo"
              className="h-12 w-12 object-contain"
              draggable={false}
            />
            <span className="text-xl font-bold" style={{ color: colors.black }}>
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
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:bg-red-100 hover:text-red-600"
                  }`
                }
              >
                {React.cloneElement(icon, { className: "stroke-current" })}
                {label}
              </NavLink>
            ))}
            <NavLink to="/login">
              <Button
                className="flex items-center gap-2 px-4 py-2 ml-4 rounded-md text-white font-semibold transition-colors duration-200"
                style={{ backgroundColor: colors.red, fontSize: 14 }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.blue)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.red)
                }
              >
                <User size={16} />
                Login
              </Button>
            </NavLink>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-red-600 focus:outline-none"
                >
                  <Menu size={28} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-4 [&>button]:hidden">
                <SheetHeader className={"p-0"}>
                  <SheetTitle
                    className="flex items-center gap-2 text-xl font-bold"
                    style={{ color: colors.black }}
                  >
                    <div className="flex items-center">
                      <img
                        src="https://imgs.search.brave.com/W3e7ENketSFhHPpNSOwXwdr-myxvrhIRfI6pWTHdAGk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/LmNvbS9pbWFnZS1j/ZG4vaW1hZ2VzL2t0/czkyOHBkL3Byb2R1/Y3Rpb24vZDlkYTk3/NzliZjNhYjJhZjBi/NTBhMDY1Yjc4Yzg2/OWE0NjA3YWRmNC03/MjB4NzIwLndlYnA_/dz01MTImcT03MiZm/bT13ZWJw"
                        alt="Logo"
                        className="h-14 w-14 object-contain"
                      />
                      Nest
                    </div>
                    <SheetClose asChild>
                      <button
                        aria-label="Close menu"
                        className="absolute top-7 right-4 rounded-md p-1 hover:text-red-600 focus:outline-none"
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
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-red-50 text-red-600"
                            : "text-gray-700 hover:bg-red-100 hover:text-red-600"
                        }`
                      }
                      onClick={() => {
                        // Sheet will auto-close on navigation if you set up sheet state correctly.
                        // Here it will close by default since the SheetClose is present.
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
                  <NavLink to="/login">
                    <Button
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-2 text-white font-semibold transition-colors duration-200 hover:bg-blue-600"
                      style={{ fontSize: 16, backgroundColor: colors.red }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.blue)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.red)
                      }
                    >
                      <User size={20} />
                      Login
                    </Button>
                  </NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
