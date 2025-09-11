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
  Trash2,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/utils/constants";

// Appointment Card Component
const BookingCard = ({ appointment, onCancel }) => {
  console.log(appointment);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const statusColors = {
    Confirmed: "bg-green-500",
    Pending: "bg-yellow-500",
    Cancelled: "bg-red-500",
  };

  const statusIcons = {
    Confirmed: <CheckCircle size={14} />,
    Pending: <Clock size={14} />,
    Cancelled: <XCircle size={14} />,
    Completed: <CheckCircle size={14} />,
  };

  const handleCancel = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to cancel booking
      const response = await axios.delete(
        `${API_URL}/bookings/${appointment.id}/cancel`
      );
      console.log(response);

      if (response?.data?.success) {
        // Remove from UI by calling parent's onCancel callback
        onCancel(appointment.id);

        toast.success("Booking cancelled successfully", {
          description: "Your booking has been cancelled",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(
        error?.response?.data?.message || "Failed to cancel booking",
        {
          description: "Please try again later",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to listing details page
    navigate(`/listings/${appointment.listing?.id}`);
  };

  console.log(appointment);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
      <div
        className="flex flex-col sm:flex-row cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="w-full sm:w-56 h-48 sm:h-auto flex-shrink-0">
          <img
            src={appointment.listing?.image_urls[0] || "/placeholder-image.jpg"}
            alt={appointment.listing?.title || "Property"}
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
                  {appointment.listing?.title || "Property Visit"}
                </h3>
                <Badge
                  className={`${
                    statusColors[appointment.status]
                  } text-white border-0 flex items-center gap-1 flex-shrink-0`}
                >
                  {statusIcons[appointment.status]}
                  {appointment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={14} className="flex-shrink-0" />
                <span className="text-sm truncate">
                  {appointment.listing?.street_address},{" "}
                  {appointment.listing?.city}, {appointment.listing?.state}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Date:</span>
                <p className="text-gray-600">
                  {new Date(appointment.booking_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-purple-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Attendees:</span>
                <p className="text-gray-600">{appointment.attendees}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building size={14} className="text-green-500 flex-shrink-0" />
              <div>
                <span className="font-medium">Property ID:</span>
                <p className="text-gray-600">#{appointment.listing?.id}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              View Property
            </Button>

            {appointment.status !== "Pending" ||
              (appointment.status !== "pending" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="px-4"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} className="mr-2" />
                      Cancel
                    </>
                  )}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
