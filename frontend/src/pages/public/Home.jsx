import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/utils/colors";
import { toast } from "sonner";
import RoomCard from "@/components/public/home/RoomCard";
import AnimatedCTA from "@/components/public/home/AnimatedCTA";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Main Home Component
export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [rooms, setRooms] = useState([]);
  const sliderRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/listings`);

        // Filter listings with rating above 3.5 and sort by rating (descending)
        const allListings = response.data?.data?.all_listings || [];
        const filteredRooms = allListings;
        // .filter(room => room.average_rating > 0)
        // .sort((a, b) => b.average_rating - a.average_rating)
        // .slice(0, 10); // Get top 10

        setRooms(filteredRooms);
        console.log(`Loaded ${filteredRooms.length} top-rated listings`);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 350; // Increased for better scrolling
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const activateSearch = () => {
    setIsSearchActive(true);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      deactivateSearch();
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setIsSearching(true);

    // Add slight delay for better UX
    setTimeout(() => {
      // Navigate to listings with location parameter
      navigate(`/listings?location=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(false);
      deactivateSearch(); // Close search overlay
    }, 300);
  };

  // Handle quick search from suggestions
  const handleQuickSearch = (city) => {
    if (isSearching) return;

    setIsSearching(true);
    setSearchQuery(city);

    setTimeout(() => {
      navigate(`/listings?location=${encodeURIComponent(city)}`);
      setIsSearching(false);
      deactivateSearch();
    }, 300);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

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
              Discover comfortable, affordable, and verified accommodations in
              your preferred location
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
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 z-1 left-4 flex items-center pointer-events-none">
                    <Search size={24} style={{ color: colors.primary }} />
                  </div>
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by street, city, area, or pincode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-14 pr-14 py-6 text-xl rounded-2xl border-2 shadow-2xl bg-white/95 backdrop-blur-sm"
                    style={{
                      borderColor: colors.primary,
                      fontSize: "18px",
                    }}
                    disabled={isSearching}
                  />
                  <button
                    type="button"
                    onClick={deactivateSearch}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="w-full py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                  style={{ backgroundColor: colors.primary }}
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Search size={20} />
                      Search Properties
                    </div>
                  )}
                </Button>
              </form>

              {/* Search Suggestions/Results */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 space-y-2">
                <div className="text-sm font-medium text-gray-500 px-3 py-2">
                  {!searchQuery
                    ? "Popular Locations"
                    : `Suggestions for "${searchQuery}"`}
                </div>
                {[
                  "Shoolini University,",
                  "Chandigarh University",
                  "LPU",
                  "Flame University",
                  "Azim Premji University",
                  "IIT Mandi",
                ]
                  .filter(
                    (city) =>
                      !searchQuery ||
                      city.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((city, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/80 transition-colors flex items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuickSearch(city)}
                      disabled={isSearching}
                    >
                      <MapPin size={16} style={{ color: colors.primary }} />
                      <span style={{ color: colors.dark }}>{city}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Properties Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: colors.dark }}
                >
                  Top Rated Properties
                </h2>
                {/* Slider Controls */}
                {rooms.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => scrollSlider("left")}
                      className="p-3 rounded-full hover:shadow-md transition-all cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => scrollSlider("right")}
                      className="p-3 rounded-full hover:shadow-md transition-all cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </div>
              <p
                className="hidden sm:block text-sm sm:text-lg mb-4"
                style={{ color: colors.muted }}
              >
                Handpicked accommodations with ratings above 3.5 stars
              </p>
              {rooms.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge
                    style={{
                      backgroundColor: colors.lightPrimary,
                      color: colors.primary,
                    }}
                    className="px-3 py-1"
                  >
                    <Star size={12} className="mr-1 fill-current" />
                    {rooms.length} Premium Properties
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    Avg Rating:{" "}
                    {(
                      rooms.reduce(
                        (sum, room) => sum + room.average_rating,
                        0
                      ) / rooms.length
                    ).toFixed(1)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading top-rated properties...</p>
              </div>
            </div>
          )}

          {/* Room Slider */}
          {!isLoading && rooms.length > 0 && (
            <div
              ref={sliderRef}
              className="flex overflow-x-auto scrollbar-hide pb-4 gap-6"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "x mandatory",
              }}
            >
              {rooms.map((room) => (
                <div key={room.id} style={{ scrollSnapAlign: "start" }}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!isLoading && rooms.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Star size={32} className="text-gray-400" />
              </div>
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: colors.dark }}
              >
                No Premium Properties Found
              </h3>
              <p className="text-gray-500 mb-6">
                We're working to add more high-rated properties in your area.
              </p>
              <Button
                style={{ backgroundColor: colors.primary }}
                onClick={() => navigate("/listings")}
                className="cursor-pointer"
              >
                Browse All Properties
              </Button>
            </div>
          )}

          {/* Slider Indicators */}
          {!isLoading && rooms.length > 3 && (
            <div className="flex justify-center mt-6">
              <div className="text-sm text-gray-500">
                Swipe or use arrow buttons to see more properties
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Animated CTA Section */}
      <AnimatedCTA />
    </div>
  );
}
