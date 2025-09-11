import React, { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Eye,
  Home,
  Search,
  Grid3X3,
  List,
  Users,
  HeartOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { colors } from "@/utils/colors";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

// Favorite Property Card Component with enhanced remove functionality
const FavoriteCard = ({ property, onRemove, viewMode }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await axios.delete(`${API_URL}/favorites/${property.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Show success toast
      toast.success("💔 Removed from favorites", {
        description: `${property.title} has been removed from your favorites`,
        duration: 4000,
      });
      
      // Remove from local state
      onRemove(property.id);
    } catch (error) {
      console.error("Error removing favourite:", error);
      toast.error("❌ Failed to remove favorite", {
        description: "Please try again later",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
            <Link to={`/listings/${property.id}`}>
              <img
                src={property.image_urls?.[0] || "/placeholder-image.jpg"}
                alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </Link>
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
              Available
            </Badge>
          </div>

          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <Link to={`/listings/${property.id}`}>
                <h3 className="font-bold text-lg text-gray-800 truncate pr-2 hover:text-blue-600 transition-colors">
                  {property.title}
                </h3>
              </Link>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className={`text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-full hover:bg-red-50 cursor-pointer ${
                  isRemoving ? "opacity-50 cursor-not-allowed animate-pulse" : ""
                }`}
                title="Remove from favorites"
              >
                <HeartOff size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={14} />
              <span className="text-sm truncate">
                {property.street_address}, {property.city}, {property.state}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Bed size={14} />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath size={14} />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center gap-1">
                <Square size={14} />
                <span>{property.area}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{property.seating} seats</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Owner:</span>
              <span className="text-sm font-medium">
                {property.owner?.username}
              </span>
              <span className="text-xs text-gray-500">
                ({property.owner?.mobile_no})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  ₹{property.monthlyRent?.toLocaleString() || "N/A"}/mo
                </span>
                <div className="text-sm text-gray-500">
                  Security: ₹{property.securityDeposit?.toLocaleString() || "N/A"}
                </div>
              </div>
              <Link to={`/listings/${property.id}`}>
                <Button variant="outline" size="sm">
                  <Eye size={16} className="mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view with equal height structure
  return (
    <Card className="favorite-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-0 flex flex-col h-full">
      <div className="relative">
        <Link to={`/listings/${property.id}`}>
          <img
            src={property.image_urls?.[0] || "/placeholder-image.jpg"}
            alt={property.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </Link>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className={`absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 hover:text-red-700 shadow-md transition-all duration-200 hover:scale-110 cursor-pointer ${
            isRemoving ? "opacity-50 cursor-not-allowed animate-pulse" : ""
          }`}
          title="Remove from favorites"
        >
          <HeartOff size={16} />
        </button>
        <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
          Available
        </Badge>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <Link to={`/listings/${property.id}`}>
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin size={14} />
          <span className="text-sm truncate">
            {property.street_address}, {property.city}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed size={14} />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={14} />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={14} />
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{property.seating}</span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Owner: </span>
          {property.owner?.username}
        </div>

        {/* Amenities */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {property.amenities?.slice(0, 3).map((amenity, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {amenity}
              </Badge>
            ))}
            {property.amenities?.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                +{property.amenities.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow"></div>

        {/* Footer - always at bottom */}
        <div className="flex justify-between items-center pt-3 border-t mt-auto">
          <div>
            <span
              className="text-xl font-bold"
              style={{ color: colors.primary }}
            >
              ₹{property.monthlyRent?.toLocaleString() || "N/A"}
            </span>
            <span className="text-sm text-gray-500">/mo</span>
            <div className="text-xs text-gray-500">
              Security: ₹{property.securityDeposit?.toLocaleString() || "N/A"}
            </div>
          </div>
          <Link to={`/listings/${property.id}`}>
            <Button variant="outline" size="sm">
              <Eye size={16} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Favourites Page Component
export default function UserFavourites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch favourites from API
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log(response);
        if (response.data?.success) {
          setFavorites(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
        toast.error("Failed to load favorites", {
          description: "Please refresh the page to try again",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user]);

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter((property) => {
      const matchesSearch =
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.street_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        property.propertyType?.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.monthlyRent || 0) - (b.monthlyRent || 0);
        case "price_desc":
          return (b.monthlyRent || 0) - (a.monthlyRent || 0);
        case "dateAdded":
        default:
          return b.id - a.id; // Assuming higher ID means more recent
      }
    });

  const handleRemoveFavorite = (propertyId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const handleViewProperty = (property) => {
    navigate(`/listings/${property.id}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">
            Please log in to view your favourite listings
          </p>
          <Button
            onClick={() => navigate("/login")}
            style={{ backgroundColor: colors.primary }}
            className="cursor-pointer"
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favourites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add CSS for equal height cards */}
      <style jsx>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .equal-height-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          grid-auto-rows: 1fr;
        }

        .favorite-card {
          min-height: 450px;
        }

        @media (max-width: 768px) {
          .equal-height-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold bg-clip-text text-transparent"
                style={{ color: colors.primary }}
              >
                My Favourites
              </h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} propert{favorites.length !== 1 ? "ies" : "y"}{" "}
                in your wishlist
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="cursor-pointer"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="cursor-pointer"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    placeholder="Search by title, address, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="pg">PG</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateAdded">Recently Added</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Favorites Grid/List */}
        {filteredFavorites.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Heart size={64} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {searchQuery || filterType !== "all"
                  ? "No results found"
                  : "No favorites yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start browsing properties and add them to your favorites!"}
              </p>
              <Button
                style={{ backgroundColor: colors.primary }}
                onClick={() => navigate("/listings")}
                className="cursor-pointer"
              >
                <Home size={16} className="mr-2" />
                Browse Properties
              </Button>
            </div>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "equal-height-grid"
                : "grid grid-cols-1 gap-6"
            }
          >
            {filteredFavorites.map((property) => (
              <FavoriteCard
                key={property.id}
                property={property}
                onRemove={handleRemoveFavorite}
                onView={handleViewProperty}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
