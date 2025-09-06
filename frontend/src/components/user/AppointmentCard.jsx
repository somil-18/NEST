import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

// Appointment Card Component
const AppointmentCard = ({ appointment }) => {
  const statusColors = {
    Confirmed: "bg-green-500",
    Pending: "bg-yellow-500",
    Cancelled: "bg-red-500",
    Completed: "bg-blue-500",
  };

  const statusIcons = {
    Confirmed: <CheckCircle size={14} />,
    Pending: <Clock size={14} />,
    Cancelled: <XCircle size={14} />,
    Completed: <CheckCircle size={14} />,
  };
  console.log(appointment);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
          <img
            src={
              appointment.listing?.main_image_url || "/placeholder-image.jpg"
            }
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
                <h3 className="font-semibold text-lg text-gray-800 truncate">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
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
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
