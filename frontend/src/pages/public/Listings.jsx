import React, { useState, useMemo, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Heart,
  Wifi,
  Car,
  Utensils,
  Home,
  AirVent,
  Shield,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/utils/colors";
import { Link } from "react-router-dom";
import FilterPanel from "@/components/public/listings/FilterPanel";
import ActiveFilters from "@/components/public/listings/ActiveFilters";
import ListingPagination from "@/components/public/listings/ListingPagination";

// Sample rooms data with multiple images
const sampleRooms = [
  {
    id: 1,
    title: "Luxury Studio Apartment",
    description:
      "Modern furnished studio with premium amenities in prime location. Perfect for working professionals with high-speed internet and 24/7 security.",
    price: 15000,
    location: "Bandra West, Mumbai",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    amenities: ["Wi-Fi", "AC", "Kitchen", "Parking"],
  },
  {
    id: 2,
    title: "Spacious 2BHK Flat",
    description:
      "Well-ventilated flat with modern furniture and great connectivity to IT hubs. Ideal for couples or small families.",
    price: 18000,
    location: "Koramangala, Bangalore",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    amenities: ["Wi-Fi", "Parking", "Security", "AC"],
  },
  {
    id: 3,
    title: "Premium PG Room",
    description:
      "Luxury PG with all meals included and housekeeping services. Perfect for students and young professionals.",
    price: 12000,
    location: "Sector 62, Noida",
    rating: 4.5,
    images: [
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    amenities: ["Wi-Fi", "Meals", "Laundry", "AC"],
  },
  {
    id: 4,
    title: "Executive Studio",
    description:
      "Premium studio apartment with concierge services and modern amenities",
    price: 22000,
    location: "Powai, Mumbai",
    rating: 4.9,
    images: [
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    amenities: ["Wi-Fi", "Gym", "Pool", "Security"],
  },
  {
    id: 5,
    title: "Cozy Single Room",
    description:
      "Affordable single room with basic amenities in a safe neighborhood",
    price: 8000,
    location: "Andheri East, Mumbai",
    rating: 4.2,
    images: [
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    amenities: ["Wi-Fi", "AC", "Kitchen"],
  },
  // Add more rooms for pagination demo
  ...Array.from({ length: 50 }, (_, i) => ({
    id: i + 6,
    title: `Room ${i + 6} in City`,
    description: `Comfortable accommodation with modern amenities and good connectivity to major areas.`,
    price: Math.floor(Math.random() * 15000) + 5000,
    location: [
      "Mumbai",
      "Bangalore",
      "Delhi",
      "Pune",
      "Hyderabad",
      "Chennai",
      "Kolkata",
    ][Math.floor(Math.random() * 7)],
    rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
    images: [
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D",
    ],
    amenities: [
      "Wi-Fi",
      "AC",
      "Kitchen",
      "Parking",
      "Security",
      "Gym",
      "Pool",
      "Laundry",
      "Meals",
    ].slice(0, Math.floor(Math.random() * 4) + 2),
  })),
];

// Custom Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Image Slider Component (keeping your existing code)
const ImageSlider = ({ images, className = "" }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={images[currentImage]}
        alt="Room"
        className="w-full h-full object-cover rounded-lg"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronLeft size={20} style={{ color: colors.dark }} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronRight size={20} style={{ color: colors.dark }} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Featured Room Slider Component (keeping your existing code)
const FeaturedRoomSlider = ({ rooms }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wi-fi":
        return <Wifi size={16} />;
      case "parking":
        return <Car size={16} />;
      case "kitchen":
      case "meals":
        return <Utensils size={16} />;
      case "ac":
        return <AirVent size={16} />;
      case "security":
        return <Shield size={16} />;
      default:
        return <Home size={16} />;
    }
  };

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        onSwiper={handleSwiperInit}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        spaceBetween={30}
        slidesPerView={1}
        className="featured-swiper mb-8"
      >
        {rooms.map((room) => (
          <SwiperSlide key={room.id}>
            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative">
                  <ImageSlider images={room.images} className="h-80 lg:h-96" />
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <Heart size={20} className="text-gray-600" />
                  </button>
                </div>

                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-medium">{room.rating}</span>
                    <Badge
                      className="ml-2"
                      style={{
                        backgroundColor: colors.lightPrimary,
                        color: colors.primary,
                      }}
                    >
                      Featured
                    </Badge>
                  </div>

                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: colors.dark }}
                  >
                    {room.title}
                  </h2>

                  <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <MapPin size={16} />
                    <span>{room.location}</span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                        style={{
                          backgroundColor: colors.lightPrimary,
                          color: colors.primary,
                        }}
                      >
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className="text-4xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        ₹{room.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <Button
                      className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: colors.primary }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.accent)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.primary)
                      }
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="w-full flex items-center justify-center mt-6">
        <div
          className="flex gap-4 px-4 py-2 rounded-2xl"
          style={{ backgroundColor: colors.light }}
        >
          <button
            ref={prevRef}
            className="z-10 bg-white cursor-pointer rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} style={{ color: colors.primary }} />
          </button>
          <button
            ref={nextRef}
            className="z-10 bg-white cursor-pointer rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight size={24} style={{ color: colors.primary }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Regular Room Card Component (keeping your existing code)
const RoomCard = ({ room }) => {
  const [isLiked, setIsLiked] = useState(false);

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wi-fi":
        return <Wifi size={12} />;
      case "parking":
        return <Car size={12} />;
      case "kitchen":
      case "meals":
        return <Utensils size={12} />;
      case "ac":
        return <AirVent size={12} />;
      case "security":
        return <Shield size={12} />;
      default:
        return <Home size={12} />;
    }
  };

  return (
    <Card className="overflow-hidden p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={room.images[0]}
          alt={room.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={`${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{room.rating}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-semibold text-lg truncate"
            style={{ color: colors.dark }}
          >
            {room.title}
          </h3>
          <div className="text-right ml-2">
            <span
              className="text-xl font-bold"
              style={{ color: colors.primary }}
            >
              ₹{room.price.toLocaleString()}
            </span>
            <div className="text-xs text-gray-500">/month</div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
          <MapPin size={12} />
          <span className="truncate">{room.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs flex items-center gap-1"
              style={{ backgroundColor: colors.light, color: colors.primary }}
            >
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{room.amenities.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};



// Main Listings Page Component
export default function Listings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const roomsPerPage = 12;

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    minRating: 0,
    sortBy: "default",
  });

  const listingsRef = useRef(null);

  // Debounced search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Enhanced filter function with sorting
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = sampleRooms.filter((room) => {
      // Search query filter
      const matchesSearch =
        !debouncedSearchQuery.trim() ||
        room.location
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        room.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // Price range filter
      const withinPriceRange =
        room.price >= filters.priceRange[0] &&
        room.price <= filters.priceRange[1];

      // Rating filter
      const meetsRatingRequirement = room.rating >= filters.minRating;

      return matchesSearch && withinPriceRange && meetsRatingRequirement;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_asc":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [debouncedSearchQuery, filters]);

  // Get top 5 featured rooms
  const featuredRooms = filteredAndSortedRooms.slice(0, 5);

  // Get paginated rooms (excluding featured ones)
  const otherRooms = filteredAndSortedRooms.slice(5);
  const totalPages = Math.ceil(otherRooms.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const paginatedRooms = otherRooms.slice(
    startIndex,
    startIndex + roomsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      minRating: 0,
      sortBy: "default",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (listingsRef.current) {
      listingsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Search Section */}
      <section className="py-12 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl font-bold mb-6"
              style={{ color: colors.dark }}
            >
              Find Your Perfect Home
            </h1>
            <p className="text-lg mb-8" style={{ color: colors.muted }}>
              Discover verified accommodations in your preferred location
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={24} style={{ color: colors.primary }} />
              </div>
              <Input
                type="text"
                placeholder={`Search by city, area, or pincode`}
                value={searchQuery}
                onChange={handleSearch}
                className="px-14 py-6 text-lg border-2 shadow-lg focus:shadow-xl transition-all"
                style={{
                  borderColor: colors.border,
                  fontSize: "16px",
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter size={20} style={{ color: colors.muted }} />
                </Button>
              </div>
            </div>

            {(debouncedSearchQuery ||
              filteredAndSortedRooms.length !== sampleRooms.length) && (
              <div className="mt-4 text-sm" style={{ color: colors.muted }}>
                {debouncedSearchQuery && (
                  <span>
                    Showing results for "<strong>{debouncedSearchQuery}</strong>
                    " •
                  </span>
                )}
                <span> {filteredAndSortedRooms.length} properties found</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Featured Properties Slider */}
      {!searchQuery && featuredRooms.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.dark }}
                >
                  Featured Properties
                </h2>
                <p className="text-lg" style={{ color: colors.muted }}>
                  Handpicked premium accommodations
                </p>
              </div>
              <Badge
                className="px-4 py-2"
                style={{
                  backgroundColor: colors.lightPrimary,
                  color: colors.primary,
                }}
              >
                {featuredRooms.length} Featured
              </Badge>
            </div>

            <FeaturedRoomSlider rooms={featuredRooms} />
          </div>
        </section>
      )}

      {/* All Properties Section */}
      <section ref={listingsRef} className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: colors.dark }}
              >
                All Properties
              </h2>
              <p className="text-lg" style={{ color: colors.muted }}>
                Browse all available accommodations
              </p>
            </div>
            <div className="text-sm" style={{ color: colors.muted }}>
              {otherRooms.length} properties • Page {currentPage} of{" "}
              {totalPages}
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {paginatedRooms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                {paginatedRooms.map((room) => (
                  <Link to={`/listings/${room.id}`} key={room.id}>
                    <RoomCard room={room} />
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <ListingPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: colors.dark }}
                >
                  No properties found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or filters to see more
                  results.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleClearFilters}
                    className="px-6 py-2 mr-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
