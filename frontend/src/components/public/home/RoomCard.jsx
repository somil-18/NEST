import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/utils/colors";
import {
  Utensils,
  Wifi,
  Car,
  Heart,
  Star,
  MapPin,
  AccessibilityIcon,
} from "lucide-react";
import { useState } from "react";

// Room Card Component
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
      default:
        return <AccessibilityIcon />;
    }
  };

  return (
    <Card className="p-0 flex-shrink-0 w-80 mx-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={room.image}
          alt={room.title}
          draggable="false"
          className="w-full h-48 object-cover rounded-t-lg"
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
          <h3 className="font-semibold text-lg" style={{ color: colors.dark }}>
            {room.title}
          </h3>
          <div className="text-right">
            <span
              className="text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              ₹{room.price.toLocaleString()}
            </span>
            <div className="text-sm text-gray-500">/month</div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
          <MapPin size={12} />
          <span>{room.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {room.amenities.map((amenity, index) => (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
