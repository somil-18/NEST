import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { colors } from "@/utils/colors";
import RoomCard from "@/components/public/home/RoomCard";
import AnimatedCTA from "@/components/public/home/AnimatedCTA";

// Sample room data
const sampleRooms = [
  {
    id: 1,
    title: "Cozy Studio Apartment",
    description: "Modern furnished studio with all amenities in prime location",
    price: 12000,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    location: "Bandra West, Mumbai",
    rating: 4.5,
    amenities: ["Wi-Fi", "AC", "Kitchen"],
  },
  {
    id: 2,
    title: "Spacious 2BHK Flat",
    description:
      "Well-ventilated flat with modern furniture and great connectivity",
    price: 18000,
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400",
    location: "Koramangala, Bangalore",
    rating: 4.8,
    amenities: ["Wi-Fi", "Parking", "Security"],
  },
  {
    id: 3,
    title: "Premium PG Room",
    description: "Luxury PG with all meals included and housekeeping services",
    price: 8500,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    location: "Sector 62, Noida",
    rating: 4.2,
    amenities: ["Wi-Fi", "Meals", "Laundry"],
  },
  {
    id: 4,
    title: "Modern Shared Room",
    description: "Shared accommodation with professional roommates",
    price: 6000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    location: "Whitefield, Bangalore",
    rating: 4.0,
    amenities: ["Wi-Fi", "AC", "Kitchen"],
  },
  {
    id: 5,
    title: "Executive Studio",
    description: "Premium studio apartment with concierge services",
    price: 22000,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
    location: "Powai, Mumbai",
    rating: 4.9,
    amenities: ["Wi-Fi", "Gym", "Pool"],
  },
];

// Main Home Component
export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sliderRef = useRef(null);
  const searchInputRef = useRef(null);

  const activateSearch = () => {
    setIsSearchActive(true);
    // Focus the input after animation
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  };

  const deactivateSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  // Handle click outside search area
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      deactivateSearch();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSearchActive) {
        deactivateSearch();
      }
    };

    if (isSearchActive) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isSearchActive]);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
            isSearchActive ? "blur-md scale-105" : ""
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920')`,
          }}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isSearchActive ? "bg-black/90" : "bg-black/30"
          }`}
        />

        {/* Hero Content */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isSearchActive ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              Find Your Perfect
              <span className="block" style={{ color: colors.accent }}>
                Nest
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              Discover comfortable, affordable, and verified PG accommodations
              in your preferred location
            </p>

            {/* Initial Search Bar */}
            {!isSearchActive && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={activateSearch}
                  className="w-full cursor-text bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl hover:bg-white transition-all duration-300 group flex items-center gap-4 text-left"
                >
                  <Search
                    size={24}
                    style={{ color: colors.primary }}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div
                      className="text-lg font-light"
                      style={{ color: colors.muted }}
                    >
                      Search by city, area, or pincode
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Full Screen Search Overlay */}
        {isSearchActive && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-6"
            onClick={handleBackdropClick}
          >
            <div className="w-full max-w-2xl">
              {/* Search Input */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 z-1 left-4 flex items-center pointer-events-none">
                  <Search size={24} style={{ color: colors.primary }} />
                </div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by city, area, or pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-14 py-6 text-xl rounded-2xl border-2 shadow-2xl bg-white/95 backdrop-blur-sm"
                  style={{
                    borderColor: colors.primary,
                    fontSize: "18px",
                  }}
                />
                <button
                  onClick={deactivateSearch}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Suggestions/Results */}
              {searchQuery && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 space-y-2">
                  <div className="text-sm font-medium text-gray-500 px-3 py-2">
                    Popular searches
                  </div>
                  {[
                    "Mumbai, Maharashtra",
                    "Bangalore, Karnataka",
                    "Delhi, NCR",
                    "Pune, Maharashtra",
                    "Hyderabad, Telangana",
                  ]
                    .filter((city) =>
                      city.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((city, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/80 transition-colors flex items-center gap-3"
                        onClick={() => {
                          setSearchQuery(city);
                          // Handle search logic here
                        }}
                      >
                        <MapPin size={16} style={{ color: colors.primary }} />
                        <span style={{ color: colors.dark }}>{city}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Room Listings Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-4xl font-bold mb-2"
                style={{ color: colors.dark }}
              >
                Featured Properties
              </h2>
              <p className="text-lg" style={{ color: colors.muted }}>
                Handpicked accommodations in your area
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollSlider("left")}
                className="p-2 rounded-full"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollSlider("right")}
                className="p-2 rounded-full"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Room Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {sampleRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Animated CTA Section */}
      <AnimatedCTA />
    </div>
  );
}
