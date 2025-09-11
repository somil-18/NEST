import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  XCircle,
  Eye,
  Check,
  X,
  UserX,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Booking Card Component for Owner Dashboard
const BookingCard = ({ booking, onCancel }) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors = {
    Confirmed: "bg-green-500",
    Pending: "bg-yellow-500",
    Cancelled: "bg-red-500",
    Completed: "bg-blue-500",
    "Tenant Left": "bg-orange-500", // Added status color for Tenant Left
  };

  const statusIcons = {
    Confirmed: <CheckCircle size={14} />,
    Pending: <Clock size={14} />,
    Cancelled: <XCircle size={14} />,
    "Tenant Left": <UserX size={14} />, // Added icon for Tenant Left
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.patch(
        `${API_URL}/bookings/${booking.booking_id}`,
        {
          status: newStatus,
        }
      );
      console.log(response);
    } catch (error) {
      toast.error("Error updating status. Please try again.");
      console.error("Status update error:", error);
    }
    setIsUpdating(false);
  };

  const handleViewProperty = (e) => {
    e.stopPropagation();
    navigate(`/listings/${booking.listing.id}`);
  };

  const handleCardClick = () => {
    navigate(`/listings/${booking.listing.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
      <div
        className="flex flex-col sm:flex-row cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="w-full sm:w-96 h-40 sm:h-auto flex-shrink-0">
          <img
            src={booking.listing?.image_urls?.[0] || "/placeholder-image.jpg"}
            alt={booking.listing?.title || "Property"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>

        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-800 truncate hover:text-blue-600 transition-colors">
                  {booking.listing?.title || "Property Visit"}
                </h3>
                <Badge
                  className={`${
                    statusColors[booking.status]
                  } text-white border-0 flex items-center gap-1 flex-shrink-0`}
                >
                  {statusIcons[booking.status]}
                  {booking.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="text-sm truncate">
                  {booking.listing?.street_address}, {booking.listing?.city},{" "}
                  {booking.listing?.state}
                </span>
              </div>

              {/* Tenant Information */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  Tenant Details
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {booking.tenant?.username || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {booking.tenant?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span>{" "}
                    {booking.tenant?.mobile_no || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Date:</span>
                <p className="text-gray-600">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-purple-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Attendees:</span>
                <p className="text-gray-600">{booking.attendees}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building size={14} className="text-green-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Property ID:</span>
                <p className="text-gray-600">#{booking.listing?.id}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="flex-3 hover:bg-blue-50 text-blue-600 border-blue-300"
              onClick={handleViewProperty}
            >
              <Eye size={14} className="mr-2" />
              View Property
            </Button>

            {booking.status === "Pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-green-50 text-green-600 border-green-300 flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate("Confirmed");
                  }}
                  disabled={isUpdating}
                >
                  <Check size={14} className="mr-2" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 text-red-600 border-red-300 flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(booking.booking_id);
                  }}
                >
                  <X size={14} className="mr-2" />
                  Cancel
                </Button>
              </>
            )}

            {booking.status === "Confirmed" && (
              <>
                {/* NEW: Mark as Tenant Left Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-orange-50 text-orange-600 border-orange-300 flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Are you sure the tenant has left? This will update the booking status for records."
                      )
                    ) {
                      handleStatusUpdate("left");
                    }
                  }}
                  disabled={isUpdating}
                >
                  <UserX size={14} className="mr-2" />
                  Tenant Left
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
