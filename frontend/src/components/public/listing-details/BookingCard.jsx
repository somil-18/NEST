import { colors } from "@/utils/colors";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { API_URL } from "@/utils/constants";
import { toast } from "sonner";

// Booking Card Component
const BookingCard = ({ room }) => {
  const [attendees, setAttendees] = useState(1); // Single field for attendees
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  console.log(user);

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Safe data access with fallbacks
  if (!room) {
    return null;
  }

  const monthlyRent = room.monthlyRent || 0;
  const securityDeposit = room.securityDeposit || 0;
  const maxGuests = room.seating || 1;
  const listingId = room.id; // Default to room's id, not editable

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total (for demo purposes - you might want different logic)
  const calculateTotal = () => {
    return monthlyRent + securityDeposit;
  };

  // Handle reservation
  const handleReserve = async () => {
    setLoading(true);
    if (!user || user?.user?.role !== "user") {
      toast.error("Please log in as a user to make a reservation.");
      setLoading(false);
      return;
    }

    // Construct payload
    const payload = {
      attendees: attendees,
      listing_id: listingId,
    };
    console.log(payload);

    console.log("Booking payload:", payload);
    // TODO: Send payload to backend API
    try {
      const response = await axios.post(`${API_URL}/bookings/create`, payload, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      console.log("Booking response:", response.data);
      if (response.data.success) {
        toast.success(response?.data?.message || "Reservation successful!");
      } else {
        toast.error("Failed to make a reservation. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to make a reservation"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky shadow-xl border-0">
      <CardContent className="p-6">
        {/* Pricing Header */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className="text-3xl font-bold"
              style={{ color: colors.primary }}
            >
              {formatCurrency(monthlyRent)}
            </span>
            <span className="text-gray-500">/month</span>
          </div>

          {securityDeposit > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} />
              <span>Security Deposit: {formatCurrency(securityDeposit)}</span>
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        {/* Booking Form */}
        <div className="space-y-4 mb-6">
          {/* Attendees (labeled as "Attendees" but internally uses attendees state) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Users size={16} />
              Attendees
            </label>
            <select
              disabled={!user || user?.user?.role !== "user"}
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
              style={{ borderColor: colors.border }}
            >
              {Array.from({ length: maxGuests }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 > 1 ? "attendees" : "attendee"}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Maximum {maxGuests} attendees allowed
            </p>
          </div>

          {/* Hidden Listing ID Display (for reference) */}
          <div className="text-xs text-gray-400">Listing ID: {listingId}</div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Monthly Rent</span>
            <span>{formatCurrency(monthlyRent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Security Deposit</span>
            <span>{formatCurrency(securityDeposit)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span style={{ color: colors.primary }}>
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>

        {!user || user?.user?.role !== "user" ? (
          <p className="text-sm text-red-500 mb-4 text-center font-bold">
            Please log in as a user to make a reservation.
          </p>
        ) : (
          // Action Buttons
          <>
            <div className="space-y-3">
              <Button
                className="w-full py-3 text-lg font-semibold transition-all text-white hover:scale-[1.02]"
                style={{ backgroundColor: colors.primary }}
                disabled={attendees < 1 || loading}
                onClick={handleReserve}
              >
                {loading ? "Please wait..." : "Reserve Now"}
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              You won't be charged yet
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
