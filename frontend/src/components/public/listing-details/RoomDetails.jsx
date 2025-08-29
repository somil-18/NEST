import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colors } from "@/utils/colors";
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
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Room Details Component
const RoomDetails = ({ room }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const navigate = useNavigate();

  const visibleAmenities = showAllAmenities
    ? room.amenities
    : room.amenities.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between w-full bg-blue-100 py-1 inset-3 rounded gap-4 mb-2">
            <div className="flex items-center">
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
                <span className="font-medium">{room.rating}</span>
                <span className="text-gray-500">
                  ({room.reviewCount} reviews)
                </span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-3">
                <Share2 size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-3"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  size={20}
                  className={`${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </Button>
            </div>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.dark }}
          >
            {room.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={16} />
            <span>{room.location}</span>
          </div>

          {/* Capacity Info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-6 w-fit">
            <div className="flex items-center gap-1 bg-gray-300 rounded px-2 py-1">
              <Users size={16} />
              <span>{room.capacity.guests} guests</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-300 rounded px-2 py-1">
              <Bed size={16} />
              <span>{room.capacity.bedrooms} bedroom</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-300 rounded px-2 py-1">
              <Bath size={16} />
              <span>{room.capacity.bathrooms} bathroom</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-300 rounded px-2 py-1">
              <Maximize size={16} />
              <span>{room.capacity.area}</span>
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
        <p className="text-gray-700 leading-relaxed">{room.description}</p>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: colors.dark }}>
          Amenities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visibleAmenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div style={{ color: colors.primary }}>{amenity.icon}</div>
              <div>
                <span className="font-medium">{amenity.name}</span>
                <div className="text-xs text-gray-500">{amenity.category}</div>
              </div>
            </div>
          ))}
        </div>

        {room.amenities.length > 6 && (
          <Button
            variant="outline"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="mt-4 w-full md:w-auto"
          >
            {showAllAmenities ? (
              <>
                Show Less <ChevronUp size={16} className="ml-2" />
              </>
            ) : (
              <>
                Show All {room.amenities.length} Amenities{" "}
                <ChevronDown size={16} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </div>

      <Separator />

      {/* Additional Information Tabs */}
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">House Rules</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="host">Host Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">House Rules</h3>
              <ul className="space-y-2">
                {room.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Policies</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={16} style={{ color: colors.primary }} />
                  <div>
                    <div className="font-medium">
                      Check-in: {room.policies.checkIn}
                    </div>
                    <div className="font-medium">
                      Check-out: {room.policies.checkOut}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar
                    size={16}
                    style={{ color: colors.primary }}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium">Cancellation Policy</div>
                    <div className="text-gray-600">
                      {room.policies.cancellation}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge
                    className="mt-1"
                    style={{
                      backgroundColor: colors.lightPrimary,
                      color: colors.primary,
                    }}
                  >
                    Deposit
                  </Badge>
                  <div className="text-gray-600">{room.policies.deposit}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="host" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users size={24} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{room.host.name}</h3>
                    {room.host.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm">{room.host.rating} rating</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm">
                      Host since {room.host.joinedDate}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <div>Response rate: {room.host.responseRate}</div>
                    <div>Response time: {room.host.responseTime}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone size={16} className="mr-2" />
                      Call
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

        <TabsContent value="location" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Nearby Places</h3>
              <div className="space-y-3">
                {room.nearbyPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <div className="font-medium">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.type}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {place.distance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomDetails;
