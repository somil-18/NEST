import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
  Bed,
  Bath,
  Square,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/utils/colors";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import FilterPanel from "@/components/public/listings/FilterPanel";
import ActiveFilters from "@/components/public/listings/ActiveFilters";
import ListingPagination from "@/components/public/listings/ListingPagination";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Format currency in INR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Image Slider Component
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
        onError={(e) => {
          e.target.src = "/placeholder-image.jpg";
        }}
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

// Featured Room Slider Component
const FeaturedRoomSlider = ({ rooms, favoriteIds, onFavoriteToggle }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processingLikes, setProcessingLikes] = useState(new Set());

  const handleLikeToggle = async (e, roomId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("You must be logged in to add favorites!", {
        description:
          "Create an account or sign in to save your favorite properties",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (processingLikes.has(roomId)) return;

    setProcessingLikes((prev) => new Set([...prev, roomId]));
    const isCurrentlyLiked = favoriteIds.has(roomId);

    try {
      if (isCurrentlyLiked) {
        await axios.delete(`${API_URL}/favorites/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        onFavoriteToggle(roomId, false);
        toast("💔 Removed from favorites", {
          description: "Property removed from your favorites list",
        });
      } else {
        await axios.post(
          `${API_URL}/favorites/${roomId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        onFavoriteToggle(roomId, true);
        toast.success("❤️ Added to favorites!", {
          description: "Property saved to your favorites list",
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("❌ Failed to update favorites", {
        description: "Please try again later",
      });
    } finally {
      setProcessingLikes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wi-fi":
      case "wifi":
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
                  <ImageSlider
                    images={room.image_urls || ["/placeholder-image.jpg"]}
                    className="h-80 lg:h-96"
                  />
                  <button
                    onClick={(e) => handleLikeToggle(e, room.id)}
                    disabled={processingLikes.has(room.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 z-10 cursor-pointer ${
                      processingLikes.has(room.id)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-110"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={`transition-all duration-200 ${
                        favoriteIds.has(room.id)
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-gray-600 hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>

                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="font-medium">
                      {room.average_rating || "N/A"}
                    </span>
                    <Badge
                      className={`ml-2 ${
                        room.availability_status === "Available"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      } text-white`}
                    >
                      {room.availability_status || "N/A"}
                    </Badge>
                  </div>

                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: colors.dark }}
                  >
                    {room.title || "Untitled Property"}
                  </h2>

                  <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <MapPin size={16} />
                    <span>
                      {room.street_address}, {room.city}, {room.state}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {room.description || "No description available."}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1 flex-1">
                      <Bed size={16} />
                      <span>{room.bedrooms || 0} beds</span>
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      <Bath size={16} />
                      <span>{room.bathrooms || 0} bathroom</span>
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      <Square size={16} />
                      <span>{room.area || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      <Users size={16} />
                      <span>{room.seating || 0} seating</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities && Array.isArray(room.amenities) ? (
                      <>
                        {room.amenities.slice(0, 4).map((amenity, index) => (
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
                        {room.amenities.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{room.amenities.length - 4} more
                          </Badge>
                        )}
                      </>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="flex items-center">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          {formatCurrency(room.monthlyRent || 0)}
                        </span>
                        <span className="text-gray-500 ml-1">/month</span>
                      </span>
                      <div className="text-sm text-gray-500 underline">
                        Security: {formatCurrency(room.securityDeposit || 0)}
                      </div>
                    </div>
                    <Link to={`/listings/${room.id}`}>
                      <Button
                        className="px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                        style={{ backgroundColor: colors.primary }}
                      >
                        View Details
                      </Button>
                    </Link>
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

// Room Card Component
const RoomCard = ({ room, favoriteIds, onFavoriteToggle }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!room) {
    return (
      <Card className="overflow-hidden p-0 shadow-lg h-full flex flex-col">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No data available</span>
        </div>
      </Card>
    );
  }

  const isLiked = favoriteIds.has(room.id);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("You must be logged in to add favorites!", {
        description:
          "Create an account or sign in to save your favorite properties",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (isLiked) {
        await axios.delete(`${API_URL}/favorites/${room.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        onFavoriteToggle(room.id, false);
        toast("💔 Removed from favorites", {
          description: "Property removed from your favorites list",
        });
      } else {
        await axios.post(
          `${API_URL}/favorites/${room.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        onFavoriteToggle(room.id, true);
        toast.success("❤️ Added to favorites!", {
          description: "Property saved to your favorites list",
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("❌ Failed to update favorites", {
        description: "Please try again later",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    if (!amenity || typeof amenity !== "string") return <Home size={12} />;

    switch (amenity.toLowerCase()) {
      case "wi-fi":
      case "wifi":
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

  const truncateDescription = (text, maxLength = 80) => {
    if (!text || typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const truncateTitle = (text, maxLength = 25) => {
    if (!text || typeof text !== "string") return "Untitled";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const truncateAmenity = (text, maxLength = 8) => {
    if (!text || typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const safeFormatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-48 flex-shrink-0">
        <img
          src={room.image_urls?.[0] || "/placeholder-image.jpg"}
          alt={room.title || "Property image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
        />
        <button
          onClick={handleLikeToggle}
          disabled={isProcessing}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 z-10 cursor-pointer ${
            isProcessing
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110 hover:shadow-lg"
          }`}
        >
          <Heart
            size={16}
            className={`transition-all duration-200 ${
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-600 hover:text-red-400"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">
            {room.average_rating || "N/A"}
          </span>
        </div>
        <Badge
          className={`absolute top-3 left-3 ${
            room.availability_status === "Available"
              ? "bg-green-500"
              : "bg-orange-500"
          } text-white`}
        >
          {room.availability_status || "N/A"}
        </Badge>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 min-h-[3rem]">
          <h3
            className="font-semibold text-lg flex-1 leading-tight"
            style={{ color: colors.dark }}
            title={room.title || "Untitled"}
          >
            {truncateTitle(room.title)}
          </h3>
          <div className="text-right ml-2 flex-shrink-0">
            <span
              className="text-xl font-bold block"
              style={{ color: colors.primary }}
            >
              {safeFormatCurrency(room.monthlyRent)}
            </span>
            <div className="text-xs text-gray-500">/month</div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2 text-sm text-gray-600 min-h-[1.25rem]">
          <MapPin size={12} className="flex-shrink-0" />
          <span className="truncate">
            {room.city || "Unknown"}, {room.state || "Unknown"}
          </span>
        </div>

        <div className="mb-3 min-h-[2.5rem] flex items-start">
          <p
            className="text-gray-600 text-sm leading-tight"
            title={room.description || ""}
          >
            {truncateDescription(room.description)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3 text-xs text-gray-600 min-h-[1rem]">
          <div className="flex items-center gap-1">
            <Bed size={12} />
            <span>{room.bedrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={12} />
            <span>{room.bathrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={12} />
            <span>{room.area || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{room.seating || 0}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-auto">
          {room.amenities && Array.isArray(room.amenities)
            ? room.amenities.slice(0, 3).map((amenity, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                  style={{
                    backgroundColor: colors.light,
                    color: colors.primary,
                  }}
                >
                  {getAmenityIcon(amenity)}
                  {truncateAmenity(amenity)}
                </Badge>
              ))
            : null}
          {room.amenities &&
            Array.isArray(room.amenities) &&
            room.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{room.amenities.length - 3}
              </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Listings Component
export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationParam = searchParams.get("location");

  // Separate states for input value and search query
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const roomsPerPage = 12;

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    minRating: 0,
    sortBy: "default",
  });

  const listingsRef = useRef(null);

  // Handle URL location parameter
  useEffect(() => {
    if (locationParam) {
      setInputValue(locationParam);
      setSearchQuery(locationParam);
      toast.success(`🔍 Searching for properties in ${locationParam}`, {
        description: "Showing results for your location search",
      });
    } else {
      setInputValue("");
      setSearchQuery("");
    }
  }, [locationParam]);

  // **KEY CHANGE**: Fetch from backend search endpoint when query present
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let url = `${API_URL}/listings`;

        // If there's a location parameter, use the search endpoint
        if (locationParam && locationParam.trim() !== "") {
          url = `${API_URL}/listings/search?location=${encodeURIComponent(
            locationParam
          )}`;
        }

        const response = await axios.get(url);
        console.log(response);

        if (locationParam && locationParam.trim() !== "") {
          // For search results, use response.data.data directly as listings
          setRooms(response.data.data || []);
          setFeaturedRooms([]); // Clear featured rooms when searching
        } else {
          // For normal listings, use the structured response
          setRooms(response.data?.data?.all_listings || []);
          setFeaturedRooms(response.data?.data?.featured || []);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to load listings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [locationParam]); // Refetch when locationParam changes

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavoriteIds(new Set());
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data?.success) {
          const favorites = response.data.data || [];
          const likedIds = new Set(favorites.map((fav) => fav.id));
          setFavoriteIds(likedIds);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Handle favorite toggle
  const handleFavoriteToggle = (roomId, isLiked) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.add(roomId);
      } else {
        newSet.delete(roomId);
      }
      return newSet;
    });
  };

  // **SIMPLIFIED**: Since backend handles search, we only need to filter by price/rating
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter((room) => {
      const withinPriceRange =
        (room.monthlyRent || 0) >= filters.priceRange[0] &&
        (room.monthlyRent || 0) <= filters.priceRange[1];

      const meetsRatingRequirement =
        (room.average_rating || 0) >= filters.minRating;

      return withinPriceRange && meetsRatingRequirement;
    });

    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (a.monthlyRent || 0) - (b.monthlyRent || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (b.monthlyRent || 0) - (a.monthlyRent || 0));
        break;
      case "rating_desc":
        filtered.sort(
          (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
        );
        break;
      case "rating_asc":
        filtered.sort(
          (a, b) => (a.average_rating || 0) - (b.average_rating || 0)
        );
        break;
      default:
        break;
    }

    console.log(filtered);
    return filtered;
  }, [rooms, filters]);

  const totalPages = Math.ceil(filteredAndSortedRooms.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const paginatedRooms = filteredAndSortedRooms.slice(
    startIndex,
    startIndex + roomsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Only update inputValue on change, not searchQuery
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Search button handler - navigates to search URL
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setIsSearching(true);

    // Navigate to search URL which will trigger the fetch
    setCurrentPage(1);
    setSearchParams({ location: inputValue.trim() });

    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // **UPDATED**: Clear search function - navigates back to /listings
  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({});
    navigate("/listings");
    toast.success("🔄 Search cleared", {
      description: "Showing all available properties",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            style={{ backgroundColor: colors.primary }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  console.log(rooms);

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

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={24} style={{ color: colors.primary }} />
                </div>
                <Input
                  type="text"
                  placeholder="Search by city, area, or pincode"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="px-14 pr-20 py-6 text-lg border-2 shadow-lg focus:shadow-xl transition-all"
                  style={{
                    borderColor: colors.border,
                    fontSize: "16px",
                  }}
                  disabled={isSearching}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 rounded mr-2"
                    onClick={() => setIsFilterOpen(true)}
                    type="button"
                  >
                    <Filter size={20} style={{ color: colors.muted }} />
                  </Button>
                </div>
              </div>

              {/* Search Button and Clear Search Button */}
              <div className="flex flex-col sm:flex-row sm:justify-end justify-center gap-2">
                <Button
                  type="submit"
                  disabled={isSearching || !inputValue.trim()}
                  className="w-full sm:w-auto px-2 py-3 text-lg font-semibold text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* **UPDATED**: Clear Search Button - only show when there's a query in URL */}
                {locationParam && (
                  <Button
                    type="button"
                    onClick={handleClearSearch}
                    variant="outline"
                    className="w-full sm:w-auto px-2 py-3 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X size={20} />
                      Clear Search
                    </div>
                  </Button>
                )}
              </div>
            </form>

            {/* Search Results Info */}
            {locationParam && (
              <div className="mt-4 text-sm" style={{ color: colors.muted }}>
                <span>
                  Showing search results for "<strong>{locationParam}</strong>"
                  •
                </span>
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

      {/* Featured Properties Slider - only show when NOT searching */}
      {!locationParam && featuredRooms.length > 0 && (
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

            <FeaturedRoomSlider
              rooms={featuredRooms}
              favoriteIds={favoriteIds}
              onFavoriteToggle={handleFavoriteToggle}
            />
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
                {locationParam ? "Search Results" : "All Properties"}
              </h2>
              <p className="text-lg" style={{ color: colors.muted }}>
                {locationParam
                  ? `Properties matching "${locationParam}"`
                  : "Browse all available accommodations"}
              </p>
            </div>
            <div className="text-sm" style={{ color: colors.muted }}>
              {filteredAndSortedRooms.length} properties • Page {currentPage} of{" "}
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
                    <RoomCard
                      room={room}
                      favoriteIds={favoriteIds}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
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
                  {locationParam
                    ? `No properties found for "${locationParam}". Try a different search term or clear your search.`
                    : "Try adjusting your search criteria or filters to see more results."}
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleClearFilters}
                    className="px-6 py-2 mr-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Clear Filters
                  </Button>
                  {locationParam && (
                    <Button
                      onClick={handleClearSearch}
                      variant="outline"
                      className="px-6 py-2"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
