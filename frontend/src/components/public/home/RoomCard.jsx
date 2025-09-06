import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Star, Users, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { colors } from '@/utils/colors';

// Mini Room Card Component
export default function RoomCard({ room }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listings/${room.id}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 
                 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                 w-72 flex-shrink-0"
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={room.image_urls?.[0] || '/placeholder-image.jpg'}
          alt={room.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        
        {/* Status Badge */}
        <Badge 
          className={`absolute top-3 left-3 ${
            room.availability_status === "Available" 
              ? "bg-green-500" 
              : "bg-orange-500"
          } text-white text-xs px-2 py-1`}
        >
          {room.availability_status}
        </Badge>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{room.average_rating || "N/A"}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3
          className="font-semibold text-lg leading-tight truncate"
          title={room.title}
          style={{ color: colors.dark }}
        >
          {room.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={14} />
          <span className="text-sm truncate">
            {room.city}, {room.state}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Bed size={12} />
            <span>{room.bedrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={12} />
            <span>{room.bathrooms || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{room.seating || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={12} />
            <span>{room.area || "N/A"}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1">
          {room.amenities?.slice(0, 2).map((amenity, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-2 py-1"
              style={{ backgroundColor: colors.lightPrimary, color: colors.primary }}
            >
              {amenity}
            </Badge>
          ))}
          {room.amenities?.length > 2 && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              +{room.amenities.length - 2}
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span 
              className="text-xl font-bold"
              style={{ color: colors.primary }}
            >
              {formatCurrency(room.monthlyRent)}
            </span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <div className="text-xs text-gray-500">
            {room.review_count || 0} reviews
          </div>
        </div>
      </div>
    </div>
  );
}
