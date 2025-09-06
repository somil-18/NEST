import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colors } from "@/utils/colors";
import { API_URL } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  MapPin,
  Maximize,
  MessageSquare,
  Phone,
  Share2,
  Star,
  Users,
  Wifi,
  Car,
  Utensils,
  Home,
  AirVent,
  Shield,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Import Sonner toast

// Room Details Component
const RoomDetails = ({ room }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context

  // Safe data access with fallbacks
  const amenities = room?.amenities || [];
  const owner = room?.owner || {};
  const reviews = room?.reviews || [];

  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    if (!amenity) return <Home size={16} />;

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
      case "geyser":
        return <Bath size={16} />;
      case "t.v":
        return <Home size={16} />;
      case "table":
        return <Home size={16} />;
      case "almirah":
        return <Home size={16} />;
      default:
        return <Home size={16} />;
    }
  };

  const handleLike = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to add favorites!");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await axios.post(`${API_URL}/favorites/${room.id}`);
      console.log(response);
      if (response.data?.success) {
        setIsLiked(true);
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to favorites. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDislike = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("You must be logged in to manage favorites!");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await axios.delete(`${API_URL}/favorites/${room.id}`);
      console.log(response);
      setIsLiked(false);
      toast.success("Removed from favorites!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove from favorites. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLikeToggle = () => {
    // Check if user is logged in first
    if (!user) {
      toast.error("You must be logged in to add favorites!", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (isLiked) {
      handleDislike();
    } else {
      handleLike();
    }
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      // Only check favorites if user is logged in
      if (!user) {
        setIsLiked(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/favorites`);
        const favourites = response.data?.data || [];
        const isliked = favourites.some((fav) => fav.id === room.id);
        if (isliked) {
          setIsLiked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavourites();
  }, [room.id, user]);

  // Create location string
  const locationString = [room?.street_address, room?.city, room?.state]
    .filter(Boolean)
    .join(", ");

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: room?.title || "Check out this property",
          text: room?.description || "Amazing property listed on our platform.",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between w-full bg-blue-100 py-2 px-4 rounded gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="flex items-center gap-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {room?.average_rating || "N/A"}
                </span>
                <span className="text-gray-500">
                  ({room?.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-3"
                onClick={handleShare}
              >
                <Share2 size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-3"
                onClick={handleLikeToggle}
                disabled={isProcessing}
              >
                <Heart
                  size={20}
                  className={`${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                  } ${isProcessing ? "opacity-50" : ""}`}
                />
              </Button>
            </div>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.dark }}
          >
            {room?.title || "Property Title"}
          </h1>

          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={16} />
            <span>{locationString || "Location not available"}</span>
          </div>

          {/* Property Type and Pricing */}
          <div className="flex items-center gap-4 mb-6">
            <Badge
              style={{
                backgroundColor: colors.lightPrimary,
                color: colors.primary,
              }}
              className="text-sm px-3 py-1"
            >
              {room?.propertyType || "Property"}
            </Badge>
            <Badge
              style={{
                backgroundColor: colors.lightPrimary,
                color: colors.primary,
              }}
              className="text-sm px-3 py-1"
            >
              {room?.furnishing === "Yes" ? "Furnished" : "Unfurnished"}
            </Badge>
          </div>

          {/* Capacity Info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-6 w-fit">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Users size={16} style={{ color: colors.primary }} />
              <span>{room?.seating || 0} guests</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Bed size={16} style={{ color: colors.primary }} />
              <span>{room?.bedrooms || 0} bedrooms</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Bath size={16} style={{ color: colors.primary }} />
              <span>{room?.bathrooms || 0} bathrooms</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Maximize size={16} style={{ color: colors.primary }} />
              <span>{room?.area || "N/A"}</span>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} style={{ color: colors.primary }} />
                  <span
                    className="text-2xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {formatCurrency(room?.monthlyRent || 0)}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Security Deposit: {formatCurrency(room?.securityDeposit || 0)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Pincode</div>
                <div className="font-medium">{room?.pincode || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
          About this place
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {room?.description || "No description available."}
        </p>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: colors.dark }}>
          Amenities ({amenities.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visibleAmenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div style={{ color: colors.primary }}>
                {getAmenityIcon(amenity)}
              </div>
              <span className="font-medium">{amenity}</span>
            </div>
          ))}
        </div>

        {amenities.length > 6 && (
          <Button
            variant="outline"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="mt-6 w-full md:w-auto"
          >
            {showAllAmenities ? (
              <>
                Show Less <ChevronUp size={16} className="ml-2" />
              </>
            ) : (
              <>
                Show All {amenities.length} Amenities{" "}
                <ChevronDown size={16} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>

      <Separator />

      {/* Additional Information Tabs */}
      <Tabs defaultValue="host" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="host">Host Info</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="host" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {owner?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-xl">
                      {owner?.username || "Host"}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Verified Host
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <span className="ml-2 font-medium capitalize">
                        {owner?.gender || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <span className="ml-2 font-medium">
                        {owner?.age || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone size={16} className="mr-2" />
                      Call Host
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare size={16} className="mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Property Policies</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Clock
                    size={16}
                    style={{ color: colors.primary }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium mb-2">Check-in/Check-out</div>
                    <div className="text-gray-600 space-y-1">
                      <div>Check-in: 12:00 PM onwards</div>
                      <div>Check-out: 11:00 AM</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign
                    size={16}
                    style={{ color: colors.primary }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium mb-2">Payment Terms</div>
                    <div className="text-gray-600 space-y-1">
                      <div>
                        Monthly Rent: {formatCurrency(room?.monthlyRent || 0)}
                      </div>
                      <div>
                        Security Deposit:{" "}
                        {formatCurrency(room?.securityDeposit || 0)}
                      </div>
                      <div>Advance: 1 month rent required</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar
                    size={16}
                    style={{ color: colors.primary }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium mb-2">Cancellation Policy</div>
                    <div className="text-gray-600">
                      Free cancellation up to 24 hours before check-in. After
                      that, a cancellation fee may apply.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">
                Reviews ({room?.review_count || 0})
              </h3>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Star size={24} className="text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    No reviews yet
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Be the first to review this property!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-b-0 bg-gray-100 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {review.author_username?.charAt(0)?.toUpperCase()}
                          </div>
                          <span>{review.author_username}</span>
                        </div>
                        <div>
                          <div className="font-medium">{review.user}</div>
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="text-sm">{review.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomDetails;
