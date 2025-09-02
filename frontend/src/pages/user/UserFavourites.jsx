import React, { useState } from "react";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Eye,
  Trash2,
  Home,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Grid3X3,
  List,
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

// Sample favorite listings data
const sampleFavorites = [
  {
    id: 1,
    title: "Luxury Studio Apartment",
    location: "Bandra West, Mumbai",
    price: 15000,
    originalPrice: 18000,
    rating: 4.8,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    status: "available",
    amenities: ["Wi-Fi", "AC", "Kitchen", "Parking"],
    dateAdded: "2024-08-15",
    propertyType: "Studio",
  },
  {
    id: 2,
    title: "Spacious 2BHK Flat",
    location: "Koramangala, Bangalore",
    price: 18000,
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400",
    bedrooms: 2,
    bathrooms: 2,
    area: 800,
    status: "available",
    amenities: ["Wi-Fi", "AC", "Gym", "Pool"],
    dateAdded: "2024-08-20",
    propertyType: "Apartment",
  },
  {
    id: 3,
    title: "Premium PG Room",
    location: "Sector 62, Noida",
    price: 12000,
    rating: 4.2,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    bedrooms: 1,
    bathrooms: 1,
    area: 200,
    status: "occupied",
    amenities: ["Wi-Fi", "Meals", "Laundry"],
    dateAdded: "2024-08-10",
    propertyType: "PG",
  },
];

// Favorite Property Card Component
const FavoriteCard = ({ property, onRemove, onView, viewMode }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    // Simulate API call
    setTimeout(() => {
      onRemove(property.id);
      setIsRemoving(false);
    }, 500);
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-40 object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${
                property.status === "available"
                  ? "bg-green-500"
                  : "bg-orange-500"
              } text-white`}
            >
              {property.status}
            </Badge>
          </div>

          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800 truncate pr-2">
                {property.title}
              </h3>
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
              >
                <Heart size={20} fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={14} />
              <span className="text-sm truncate">{property.location}</span>
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
                <span>{property.area} sq ft</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  ₹{property.price.toLocaleString()}/mo
                </span>
                {property.originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">
                    ₹{property.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{property.rating}</span>
                  <span className="text-xs text-gray-500">
                    ({property.reviewCount})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(property)}
                >
                  <Eye size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-0">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 hover:text-red-700 shadow-md transition-colors"
        >
          <Heart size={16} fill="currentColor" />
        </button>
        <Badge
          className={`absolute bottom-2 left-2 ${
            property.status === "available" ? "bg-green-500" : "bg-orange-500"
          } text-white`}
        >
          {property.status}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={14} />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
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
            <span>{property.area} sq ft</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{property.rating}</span>
          <span className="text-xs text-gray-500">
            ({property.reviewCount})
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span
              className="text-xl font-bold"
              style={{ color: colors.primary }}
            >
              ₹{property.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/mo</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => onView(property)}>
            <Eye size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Favourites Page Component
export default function UserFavourites() {
  const [favorites, setFavorites] = useState(sampleFavorites);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        property.propertyType.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "dateAdded":
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

  const handleRemoveFavorite = (propertyId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const handleViewProperty = (property) => {
    // Navigate to property details page
    console.log("View property:", property);
    alert(`Viewing ${property.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{color: colors.primary}}>
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
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
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
                    placeholder="Search by title or location..."
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
                  <SelectItem value="rating">Rating</SelectItem>
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
              <Button style={{ backgroundColor: colors.primary }}>
                <Home size={16} className="mr-2" />
                Browse Properties
              </Button>
            </div>
          </Card>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
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
