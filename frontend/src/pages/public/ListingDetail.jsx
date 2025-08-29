import React from "react";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Wifi, Car, Utensils, Home, AirVent, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGallery from "@/components/public/listing-details/ImageGallery";
import RoomDetails from "@/components/public/listing-details/RoomDetails";
import BookingCard from "@/components/public/listing-details/BookingCard";

// Sample room data (you can fetch this from API based on room ID)
const getRoomById = (id) => ({
  id: parseInt(id),
  title: "Luxury Studio Apartment in Bandra West",
  description:
    "Experience the epitome of comfort in this modern furnished studio apartment. Located in the heart of Bandra West, this premium accommodation offers high-speed internet, 24/7 security, and all essential amenities for working professionals and travelers.",
  price: 15000,
  originalPrice: 18000,
  location: "Bandra West, Mumbai, Maharashtra",
  rating: 4.8,
  reviewCount: 127,
  capacity: {
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: "450 sq ft",
  },
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600",
  ],
  amenities: [
    { name: "Wi-Fi", icon: <Wifi size={16} />, category: "Internet" },
    { name: "AC", icon: <AirVent size={16} />, category: "Climate" },
    { name: "Kitchen", icon: <Utensils size={16} />, category: "Cooking" },
    { name: "Parking", icon: <Car size={16} />, category: "Transport" },
    { name: "Security", icon: <Shield size={16} />, category: "Safety" },
    { name: "Furnished", icon: <Home size={16} />, category: "Furniture" },
  ],
  rules: [
    "No smoking inside the premises",
    "No pets allowed",
    "Quiet hours: 10 PM - 8 AM",
    "Maximum occupancy: 2 guests",
    "No parties or events",
  ],
  policies: {
    checkIn: "2:00 PM onwards",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    deposit: "₹2,000 security deposit required",
  },
  host: {
    name: "Rajesh Kumar",
    rating: 4.9,
    responseTime: "Within 1 hour",
    responseRate: "100%",
    verified: true,
    joinedDate: "2020",
  },
  nearbyPlaces: [
    { name: "Bandra Station", distance: "0.5 km", type: "Transport" },
    { name: "Linking Road", distance: "0.8 km", type: "Shopping" },
    { name: "Carter Road", distance: "1.2 km", type: "Recreation" },
    { name: "Lilavati Hospital", distance: "2.0 km", type: "Healthcare" },
  ],
});

// Main Listing Details Page Component
export default function ListingDetail() {
  const { id } = useParams();
  const room = getRoomById(id);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Room not found</h2>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={room.images} />
            <RoomDetails room={room} />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}
